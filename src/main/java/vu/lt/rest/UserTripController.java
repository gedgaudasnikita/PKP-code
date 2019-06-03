package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Trip;
import vu.lt.entities.User;
import vu.lt.entities.UserTrip;
import vu.lt.entities.UserTripKey;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.TripsDAO;
import vu.lt.persistence.UserTripsDAO;
import vu.lt.persistence.UsersDAO;
import vu.lt.rest.contracts.UserTripDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@LoggedInvocation
@RequestScoped
@Path("/usertrips")
public class UserTripController {

    @Inject
    @Getter @Setter
    UserTripsDAO userTripsDAO;

    @Inject
    @Getter @Setter
    TripsDAO tripsDAO;

    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @Path("/{tripId}/participants")
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserTripsForTrip(@PathParam("tripId") final Integer tripId) {
        if (tripsDAO.findById(tripId) == null) return Response.status(Response.Status.NOT_FOUND).build();

        List<UserTripDTO> userTrips = userTripsDAO.getUserTripsForTrip(tripId);
        return Response.ok(userTrips).build();
    }

    @Path("/{tripId}/participants/{participantId}")
    @AuthenticatedMethod
    @POST
    @Transactional
    public Response inviteUser(@PathParam("tripId") final Integer tripId,
                               @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);

        if (user == null || trip == null || trip.getIsCancelled() == true) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        UserTripKey key = new UserTripKey(user, trip);

        if (userTripsDAO.findByKey(key) != null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        UserTrip userTrip = new UserTrip();
        userTrip.setKey(key);
        userTrip.setParticipationStatus(UserTrip.ParticipationStatus.PENDING);

        userTripsDAO.persist(userTrip);

        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response updateParticipationStatus(@PathParam("tripId") final Integer tripId,
                                              @PathParam("participantId") final Integer participantId,
                                              UserTripDTO userTripDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        if (user == null || trip == null || trip.getIsCancelled() || userTripDTO.getParticipationStatus() == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));
        if (userTrip == null) return Response.status(Response.Status.NOT_FOUND).build();

        userTrip.setParticipationStatus(userTripDTO.getParticipationStatus());

        userTripsDAO.update(userTrip);
        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}")
    @AuthenticatedMethod
    @DELETE
    @Transactional
    public Response delete(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        if (user == null || trip == null) return Response.status(Response.Status.BAD_REQUEST).build();

        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));
        if (userTrip == null) return Response.status(Response.Status.NOT_FOUND).build();

        userTripsDAO.delete(userTrip);
        return Response.ok().build();
    }
}
