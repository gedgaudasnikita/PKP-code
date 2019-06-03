package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.*;
import vu.lt.rest.contracts.UserTripRoomDTO;

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
public class RoomDataController {

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
    RoomsDAO roomsDAO;

    @Inject
    @Getter @Setter
    DevbridgeRoomsDAO devbridgeRoomsDAO;

    @Inject
    @Getter @Setter
    HotelRoomsDAO hotelRoomsDAO;

    @Path("/{tripId}/participants/{participantId}/room")
    @GET
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        UserTripRoomDTO result = new UserTripRoomDTO();

        System.out.println(userTrip.getRoom());
        if (userTrip == null || userTrip.getRoom() == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        result.setIsDevbridgeRoom(userTrip.getRoom().getIsDevBridgeRoom());

        if (userTrip.getRoom().getIsDevBridgeRoom()) {
            DevBridgeRoom room = devbridgeRoomsDAO.findById(userTrip.getRoom().getId());

            result.setApartmentId(room.getDevBridgeApartment().getId());
            result.setRoomId(userTrip.getRoom().getId());
        } else {
            HotelRoom room = hotelRoomsDAO.findById(userTrip.getRoom().getId());
            result.setPrice(room.getPrice());;
            result.setFilename(room.getFilename());
        }

        return Response.ok(result).build();
    }

    @Path("/{tripId}/participants/{participantId}/room")
    @POST
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           UserTripRoomDTO roomDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (roomDTO.getIsDevbridgeRoom() == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } else if (roomDTO.getIsDevbridgeRoom()) { // devbridge room
            Room room = roomsDAO.findById(roomDTO.getRoomId());
            if (room == null || !room.getIsDevBridgeRoom()) return Response.status(Response.Status.BAD_REQUEST).build();
            userTrip.setRoom(room);
        } else if (roomDTO.getPrice() != null) { // hotel room
            Room room = new Room();
            room.setIsDevBridgeRoom(false);
            roomsDAO.persist(room);
            HotelRoom hotelRoom = new HotelRoom();
            hotelRoom.setFilename(roomDTO.getFilename());
            hotelRoom.setPrice(roomDTO.getPrice());
            hotelRoom.setRoom(room);
            hotelRoomsDAO.persist(hotelRoom);
            userTrip.setRoom(room);
        } else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/room")
    @PUT
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId,
                           UserTripRoomDTO roomDTO) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

         if (roomDTO.getIsDevbridgeRoom()) { // devbridge room
            Room room = roomsDAO.findById(roomDTO.getRoomId());
            if (room == null || !room.getIsDevBridgeRoom()) return Response.status(Response.Status.BAD_REQUEST).build();
            userTrip.setRoom(room);
        } else if (roomDTO.getPrice() != null) { // hotel room
            Room room = new Room();
            room.setIsDevBridgeRoom(false);
            roomsDAO.persist(room);
            HotelRoom hotelRoom = new HotelRoom();
            hotelRoom.setFilename(roomDTO.getFilename());
            hotelRoom.setPrice(roomDTO.getPrice());
            hotelRoom.setRoom(room);
            hotelRoomsDAO.persist(hotelRoom);
            userTrip.setRoom(room);
        } else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        return Response.ok().build();
    }

    @Path("/{tripId}/participants/{participantId}/room")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("tripId") final Integer tripId,
                           @PathParam("participantId") final Integer participantId) {
        Trip trip = tripsDAO.findById(tripId);
        User user = usersDAO.findById(participantId);
        UserTrip userTrip = userTripsDAO.findByKey(new UserTripKey(user, trip));

        if (user == null || trip == null || userTrip == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        userTrip.setRoom(null);
        userTripsDAO.update(userTrip);

        userTrip.setRoom(null);
        userTripsDAO.update(userTrip);
        return Response.ok().build();
    }

    @GET
    @Path("/{tripId}/participants/{participantId}/room/file")
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId
    ){
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "room" + File.separator;
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
    @Path("/{tripId}/participants/{participantId}/room/file")
    @AuthenticatedMethod
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadFile(
            @PathParam("tripId") final Integer tripId,
            @PathParam("participantId") final Integer participantId,
            @Multipart("file") Attachment file,
            @Multipart("filename") String filename
    ){
        InputStream uploadedInputStream = file.getObject(InputStream.class);
        String directoryPath = System.getProperty("user.home") + File.separator + "uploads" + File.separator + tripId + File.separator + participantId + File.separator + "room" + File.separator;
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
