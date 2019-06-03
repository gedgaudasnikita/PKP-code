package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.CarDataDAO;
import vu.lt.persistence.TripsDAO;
import vu.lt.persistence.UserTripsDAO;
import vu.lt.persistence.UsersDAO;
import vu.lt.rest.contracts.CarDataDTO;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@LoggedInvocation
@RequestScoped
@Path("/usertrips")
public class CarDataController {

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
    CarDataDAO carDataDAO;

    @Path("/{tripId}/participants/{participantId}/car")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response create(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           CarDataDTO carDataDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        CarData newCar = new CarData();
        newCar.setCapacity(carDataDTO.getCapacity());
        newCar.setModel(carDataDTO.getModel());
        newCar.setPrice(carDataDTO.getPrice());

        trip.getControlList().setIsCarRented(true);
        carDataDAO.persist(newCar);
        userTrip.setCarData(newCar);
        tripsDAO.update(trip);
        userTripsDAO.update(userTrip);
        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/car")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response update(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        CarData existingCar = userTrip.getCarData();
        if (existingCar == null) return Response.status(Response.Status.NOT_FOUND).build();

        CarDataDTO car = new CarDataDTO();
        car.setCapacity(existingCar.getCapacity());
        car.setModel(existingCar.getModel());
        car.setId(existingCar.getId());
        car.setPrice(existingCar.getPrice());
        car.setFilename(existingCar.getFilename());

        return Response.ok(car).build();
    }

    @Path("/{tripId}/participants/{participantId}/car")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response update(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           CarDataDTO carDataDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        CarData existingCar = userTrip.getCarData();
        if (existingCar == null) return Response.status(Response.Status.NOT_FOUND).build();

        existingCar.setModel(carDataDTO.getModel());
        existingCar.setCapacity(carDataDTO.getCapacity());
        existingCar.setPrice(carDataDTO.getPrice());
        existingCar.setFilename(carDataDTO.getFilename());

        carDataDAO.update(existingCar);
        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/car")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null ) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        CarData existingCar = userTrip.getCarData();;
        if (existingCar == null) return Response.status(Response.Status.NOT_FOUND).build();

        carDataDAO.delete(existingCar);
        userTrip.setCarData(null);
        userTripsDAO.update(userTrip);
        return Response.ok().build();
    }

    @GET
    @Path("/{tripId}/participants/{participantId}/car/file")
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId
    ){
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "car" + File.separator;
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
    @Path("/{tripId}/participants/{participantId}/car/file")
    @AuthenticatedMethod
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId,
            @Multipart("file") Attachment file,
            @Multipart("filename") String filename
    ){
        InputStream uploadedInputStream = file.getObject(InputStream.class);
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "car" + File.separator;
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
