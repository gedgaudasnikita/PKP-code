package vu.lt.rest;

import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.persistence.*;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.rest.contracts.TripDTO;
import vu.lt.rest.contracts.TripWithIdsDTO;

import lombok.Getter;
import lombok.Setter;
import vu.lt.rest.contracts.UserTripDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.OptimisticLockException;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.sql.Date;
import java.util.Iterator;
import java.util.List;

@RequestScoped
@Path("/trips")
public class TripController {

    @Inject
    @Getter @Setter
    TripsDAO tripsDAO;

    @Inject
    @Getter @Setter
    UserTripsDAO userTripsDAO;

    @Inject
    @Getter @Setter
    CarDataDAO carDataDAO;

    @Inject
    @Getter @Setter
    FlightDataDAO flightDataDAO;

    @Inject
    @Getter @Setter
    OfficesDAO officesDAO;

    @Inject
    @Getter @Setter
    ControlListsDAO controlListsDAO;

    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @LoggedInvocation
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTrips(
            @QueryParam("travellerId") Integer travellerId,
            @QueryParam("organizerId") final Integer organizerId) {
        List<TripDTO> trips = tripsDAO.getAllTrips();

        if (organizerId != null) {
            List<TripDTO> filteredTrips = trips;
            Iterator<TripDTO> it = filteredTrips.iterator();
            while( it.hasNext() ) {
                TripDTO trip = it.next();
                if(!trip.getOrganizer().getId().equals(organizerId)) it.remove();
            }
            trips = filteredTrips;
        }

        if (travellerId != null) {
            List<TripDTO> filteredTrips = trips;
            Iterator<TripDTO> it = filteredTrips.iterator();
            while( it.hasNext() ) {
                TripDTO trip = it.next();
                List<UserTripDTO> participations = userTripsDAO.getUserTripsForTrip(trip.getId());
                boolean found = false;
                for (UserTripDTO participation : participations) {
                    if (participation.getUser().getId().equals(travellerId)) {
                        found = true;
                    }
                }
                if(!found) it.remove();
            }
            trips = filteredTrips;
        }

        return Response.ok(trips).build();
    }

    @LoggedInvocation
    @Path("/{id}")
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTrip(@PathParam("id") final Integer id) {
        Trip trip = tripsDAO.findById(id);
        if(trip == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(TripDTO.tripToTripDTO(trip)).build();
    }

    @LoggedInvocation
    @POST
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(TripWithIdsDTO tripDTO) {
        Office startOffice = getStartOfficeFrom(tripDTO);
        Office endOffice = getEndOfficeFrom(tripDTO);
        ControlList controlList = getControlListFrom(tripDTO);
        User organizer = getOrganizerFrom(tripDTO);
        String startDateString = tripDTO.getStartDate();
        String endDateString = tripDTO.getEndDate();

//        if (!areParamsValid(startOffice, endOffice, controlList, organizer, startDateString, endDateString)) {
//            return Response.status(Response.Status.BAD_REQUEST).build();
//        }

        Date startDate = startDateString != null ? Date.valueOf(startDateString) : null;
        Date endDate = endDateString != null ? Date.valueOf(endDateString) : null;
        Trip newTrip = buildTrip(new Trip(), startOffice, endOffice, controlList, organizer, startDate, endDate, false);

        tripsDAO.persist(newTrip);

        return Response.ok(TripDTO.tripToTripDTO(newTrip)).build();
    }

    @LoggedInvocation
    @Path("/{id}")
    @AuthenticatedMethod
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("id") final Integer tripId, TripWithIdsDTO tripDTO) {
        try {
            Trip existingTrip = tripsDAO.findById(tripId);
            if (existingTrip == null) return Response.status(Response.Status.NOT_FOUND).build();

            Trip tripToUpdate = updateTrip(existingTrip, tripDTO);
            if (tripToUpdate == null) return Response.status(Response.Status.BAD_REQUEST).build();

            tripsDAO.update(tripToUpdate);

            return Response.ok().build();
        } catch (OptimisticLockException e) {
            return Response.status(Response.Status.CONFLICT).build();
        }

    }

    @LoggedInvocation
    @Path("/{id}")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("id") final Integer tripId) {
        Trip existingTrip = tripsDAO.findById(tripId);
        if (existingTrip == null) return Response.status(Response.Status.NOT_FOUND).build();

        tripsDAO.delete(existingTrip);
        return Response.ok().build();
    }

    private Boolean areParamsValid(Office startOffice, Office endOffice, ControlList controlList, User organizer, String startDate, String endDate) {
        Boolean paramsAreOk = startOffice != null && endOffice != null && controlList != null && organizer != null && startDate != null && endDate != null;
        if (!paramsAreOk) return false;

        return startOffice.getId() != endOffice.getId();
    }

    private Office getStartOfficeFrom(TripWithIdsDTO tripDTO) {
        if (tripDTO.getStartOfficeId() == null) return null;
        return officesDAO.findById(tripDTO.getStartOfficeId());
    }

    private Office getEndOfficeFrom(TripWithIdsDTO tripDTO) {
        if (tripDTO.getEndOfficeId() == null) return null;
        return officesDAO.findById(tripDTO.getEndOfficeId());
    }

    private ControlList getControlListFrom(TripWithIdsDTO tripDTO) {
        if (tripDTO.getAreTicketsRequired() == null || tripDTO.getIsAccommodationRequired() == null || tripDTO.getIsCarRequired() == null) {
            return null;
        }
        ControlList controlList = new ControlList();
        controlList.setIsAccommodationRequired(tripDTO.getIsAccommodationRequired());
        controlList.setIsAccommodationRented(tripDTO.getIsAccommodationRented());
        controlList.setIsCarRequired(tripDTO.getIsCarRequired());
        controlList.setIsCarRented(tripDTO.getIsCarRented());
        controlList.setAreTicketsRequired(tripDTO.getAreTicketsRequired());
        controlList.setAreTicketsBought(tripDTO.getAreTicketsBought());
        controlListsDAO.persist(controlList);
        return controlList;
    }

    private User getOrganizerFrom(TripWithIdsDTO tripDTO) {
        System.out.println("organizerid");
        System.out.println(tripDTO.getOrganizerId());
        if (tripDTO.getOrganizerId() == null) return null;
        return usersDAO.findById(tripDTO.getOrganizerId());
    }

    private Trip buildTrip(Trip trip, Office startOffice, Office endOffice, ControlList controlList, User organizer, Date startDate, Date endDate, Boolean isCancelled) {
        trip.setStartOffice(startOffice);
        trip.setEndOffice(endOffice);
        trip.setOrganizer(organizer);
        trip.setControlList(controlList);
        trip.setStartDate(startDate);
        trip.setEndDate(endDate);
        trip.setIsCancelled(isCancelled);
        return trip;
    }

    private Trip updateTrip(Trip existingTrip, TripWithIdsDTO tripDTO) {
        Office oldStartOffice = existingTrip.getStartOffice();
        Office oldEndOffice = existingTrip.getEndOffice();
        Integer startOfficeId = tripDTO.getStartOfficeId();
        Integer endOfficeId = tripDTO.getEndOfficeId();
        Boolean isCarRequired = tripDTO.getIsCarRequired();
        Boolean isCarRented = tripDTO.getIsCarRented();
        Boolean isAccommodationRequired = tripDTO.getIsAccommodationRequired();
        Boolean isAccommodationRented = tripDTO.getIsAccommodationRented();
        Boolean areTicketsRequired = tripDTO.getAreTicketsRequired();
        Boolean areTicketsBought = tripDTO.getAreTicketsBought();
        Integer organizerId = tripDTO.getOrganizerId();
        String startDateString = tripDTO.getStartDate();
        String endDateString = tripDTO.getEndDate();
        Date startDate = (startDateString == null) ? existingTrip.getStartDate() : Date.valueOf(startDateString);
        Date endDate = (endDateString == null) ? existingTrip.getEndDate() : Date.valueOf(endDateString);
        Boolean isCancelled = tripDTO.getIsCancelled();

        // start office
        if (startOfficeId != null && officesDAO.findById(startOfficeId) != null) {
            existingTrip.setStartOffice(officesDAO.findById(startOfficeId));
        }
        // end office
        if (endOfficeId != null && officesDAO.findById(endOfficeId) != null) {
            existingTrip.setEndOffice(officesDAO.findById(endOfficeId));
        }

        if (existingTrip.getStartOffice() == existingTrip.getEndOffice()) {
            existingTrip.setStartOffice(oldStartOffice);
            existingTrip.setEndOffice(oldEndOffice);
            return null;
        }

        // control list
        ControlList controlList = existingTrip.getControlList();
        if (isAccommodationRequired != null) controlList.setIsAccommodationRequired(isAccommodationRequired);
        if (isAccommodationRented != null) controlList.setIsAccommodationRented(isAccommodationRented);
        if (isCarRequired != null) controlList.setIsCarRequired(isCarRequired);
        if (isCarRented != null) controlList.setIsCarRented(isCarRented);
        if (areTicketsRequired != null) controlList.setAreTicketsRequired(areTicketsRequired);
        if (areTicketsBought != null) controlList.setAreTicketsBought(areTicketsBought);
        controlListsDAO.update(controlList);

        // organizer
        if (organizerId != null && officesDAO.findById(organizerId) != null) {
            existingTrip.setEndOffice(officesDAO.findById(organizerId));
        }
        // start date and end date
        if (startDate != null && endDate != null && startDate.after(endDate)) return null;
        existingTrip.setStartDate(startDate);
        existingTrip.setEndDate(endDate);
        // is cancelled
        if (isCancelled != null) existingTrip.setIsCancelled(isCancelled);

        return existingTrip;
    }
}
