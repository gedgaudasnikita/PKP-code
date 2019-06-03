package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.h2.store.fs.FileUtils;
import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.FlightDataDAO;
import vu.lt.persistence.TripsDAO;
import vu.lt.persistence.UserTripsDAO;
import vu.lt.persistence.UsersDAO;
import vu.lt.rest.contracts.FlightDataDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@LoggedInvocation
@RequestScoped
@Path("/usertrips")
public class FlightDataController {

    @Inject
    @Getter @Setter
    UserTripsDAO userTripsDAO;

    @Inject
    @Getter @Setter
    TripsDAO tripsDAO;

    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @Inject
    @Getter @Setter
    FlightDataDAO flightDataDAO;

    @Path("/{tripId}/participants/{participantId}/flight")
    @AuthenticatedMethod
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           FlightDataDTO flightDataDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        FlightData newFlight = new FlightData();
        newFlight.setPrice(flightDataDTO.getPrice());
        newFlight.setFilename(flightDataDTO.getFilename());

        userTrip.setFlightData(newFlight);
        trip.getControlList().setAreTicketsBought(true);
        flightDataDAO.persist(newFlight);
        tripsDAO.update(trip);
        userTripsDAO.update(userTrip);
        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/flight")
    @AuthenticatedMethod
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response retrieve(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        FlightData existingFlight = userTrip.getFlightData();
        if (existingFlight == null) return Response.status(Response.Status.NOT_FOUND).build();

        FlightDataDTO flightData = new FlightDataDTO();
        flightData.setPrice(existingFlight.getPrice());
        flightData.setId(existingFlight.getId());
        flightData.setFilename(existingFlight.getFilename());

        return Response.ok(flightData).build();
    }

    @Path("/{tripId}/participants/{participantId}/flight")
    @AuthenticatedMethod
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           FlightDataDTO flightDataDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        FlightData existingFlight = userTrip.getFlightData();
        if (existingFlight == null) return Response.status(Response.Status.NOT_FOUND).build();

        existingFlight.setPrice(flightDataDTO.getPrice());
        existingFlight.setFilename(flightDataDTO.getFilename());

        flightDataDAO.update(existingFlight);
        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/flight")
    @AuthenticatedMethod
    @DELETE
    @Transactional
    public Response delete(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null ) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        FlightData existingFlight = userTrip.getFlightData();
        if (existingFlight == null) return Response.status(Response.Status.NOT_FOUND).build();


        userTrip.setFlightData(null);
        userTripsDAO.update(userTrip);

        flightDataDAO.delete(existingFlight);
        return Response.ok().build();
    }

    @GET
    @Path("/{tripId}/participants/{participantId}/flight/file")
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId
    ){
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "flight" + File.separator;
        File directory = new File(directoryPath);

        File fileDownload = null;
        for(File fileEntry: directory.listFiles())
            if (!fileEntry.isDirectory())
                fileDownload = fileEntry;

        Response.ResponseBuilder response = Response.ok((Object) fileDownload);
        response.header("Content-Disposition", "attachment;filename=" + fileDownload.getName());
        return response.build();
    }

    @POST
    @Path("/{tripId}/participants/{participantId}/flight/file")
    @AuthenticatedMethod
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId,
            @Multipart("file") Attachment file,
            @Multipart("filename") String filename
    ){
        InputStream uploadedInputStream = file.getObject(InputStream.class);
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "flight" + File.separator;
        String fileLocation =  directoryPath + filename;

        File directory = new File(directoryPath);
        if (! directory.exists()){
            directory.mkdirs();
        }

        for(File fileEntry: directory.listFiles())
            if (!fileEntry.isDirectory())
                fileEntry.delete();

        java.nio.file.Path path = Paths.get(fileLocation);
        try {
            Files.copy(uploadedInputStream, path);
        } catch (Exception e) {
            System.out.println(e);
        }
        String output = "File successfully uploaded to : " + fileLocation;
        return Response.status(200).entity(output).build();
    }
}
