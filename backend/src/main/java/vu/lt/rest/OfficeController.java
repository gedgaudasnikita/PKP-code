package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Office;
import vu.lt.entities.Trip;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.OfficesDAO;
import vu.lt.persistence.TripsDAO;
import vu.lt.rest.contracts.OfficeDTO;
import vu.lt.rest.contracts.TripDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@LoggedInvocation
@RequestScoped
@Path("/offices")
public class OfficeController {

    @Inject
    @Getter @Setter
    OfficesDAO officesDAO;

    @Inject
    @Getter @Setter
    TripsDAO tripsDAO;

    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllOffices() {
        List<OfficeDTO> offices = officesDAO.getAllOffices();
        return Response.ok(offices).build();
    }

    @POST
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(OfficeDTO officeDTO) {
        String name = officeDTO.getName();
        String address = officeDTO.getAddress();
        if (name == null || address == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Office office = new Office();
        office.setAddress(address);
        office.setName(name);
        officesDAO.persist(office);
        return Response.ok().build();
    }

    @Path("/{id}")
    @AuthenticatedMethod
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("id") final Integer officeId, OfficeDTO officeDTO) {
        Office existingOffice = officesDAO.findById(officeId);
        if (existingOffice == null) return Response.status(Response.Status.NOT_FOUND).build();
        String name = officeDTO.getName();
        String address = officeDTO.getAddress();
        if (name != null) existingOffice.setName(name);
        if (address != null) existingOffice.setAddress(address);
        officesDAO.update(existingOffice);
        return Response.ok().build();
    }

    @Path("/{id}")
    @AuthenticatedMethod
    @DELETE
    @Transactional
    public Response delete(@PathParam("id") final Integer officeId) {
        Office existingOffice = officesDAO.findById(officeId);
        if (existingOffice == null) return Response.status(Response.Status.NOT_FOUND).build();

        List<TripDTO> trips = tripsDAO.getAllTrips();
        for (TripDTO tripDTO : trips) {
            if (tripDTO.getStartOffice().getId().equals(officeId)) {
                Trip trip = tripsDAO.findById(tripDTO.getId());
                trip.setStartOffice(null);
                trip.setIsCancelled(true);
                tripsDAO.update(trip);
            }
            if (tripDTO.getEndOffice().getId().equals(officeId)) {
                Trip trip = tripsDAO.findById(tripDTO.getId());
                trip.setEndOffice(null);
                trip.setIsCancelled(true);
                tripsDAO.update(trip);
            }
        }
        officesDAO.delete(existingOffice);
        return Response.ok().build();
    }
}
