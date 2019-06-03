package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.DevbridgeApartmentsDAO;
import vu.lt.persistence.DevbridgeRoomsDAO;
import vu.lt.persistence.OfficesDAO;
import vu.lt.persistence.RoomsDAO;
import vu.lt.rest.contracts.DevbridgeRoomDTO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@LoggedInvocation
@RequestScoped
@Path("/offices/{officeId}/apartments/{apartmentId}/rooms")
public class DevbridgeRoomController {

    @Inject
    @Getter @Setter
    OfficesDAO officesDAO;

    @Inject
    @Getter @Setter
    RoomsDAO roomsDAO;

    @Inject
    @Getter @Setter
    DevbridgeRoomsDAO devbridgeRoomsDAO;

    @Inject
    @Getter @Setter
    DevbridgeApartmentsDAO apartmentsDAO;

    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllRoomsForApartment(
            @PathParam("apartmentId") final Integer apartmentId,
            @PathParam("officeId") final Integer officeId) {
        Office office = officesDAO.findById(officeId);
        if (office == null) return Response.status(Response.Status.NOT_FOUND).build();

        DevBridgeApartment apartment = apartmentsDAO.findById(apartmentId);
        if (apartment == null) return Response.status(Response.Status.NOT_FOUND).build();

        List<DevbridgeRoomDTO> rooms = devbridgeRoomsDAO.getAllRoomsOfApartment(apartmentId);
        return Response.ok(rooms).build();
    }

    @Path("/{id}")
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTrip(@PathParam("id") final Integer id) {
        DevBridgeRoom room = devbridgeRoomsDAO.findById(id);
        if(room == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(DevbridgeRoomDTO.roomToDevbridgeRoomDTO(room)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response create(@PathParam("apartmentId") final Integer apartmentId,
                           @PathParam("officeId") final Integer officeId,
                           DevbridgeRoomDTO roomDTO) {
        Integer roomNumber = roomDTO.getRoomNumber();
        if (roomNumber == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Room room = new Room();
        room.setIsDevBridgeRoom(true);
        roomsDAO.persist(room);
        DevBridgeRoom devRoom = new DevBridgeRoom();
        devRoom.setDevBridgeApartment(apartmentsDAO.findById(apartmentId));
        devRoom.setRoom(room);
        devRoom.setRoomNumber(roomNumber);
        devbridgeRoomsDAO.persist(devRoom);
        return Response.ok().build();
    }

    @Path("/{id}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response update(@PathParam("apartmentId") final Integer apartmentId,
                           @PathParam("officeId") final Integer officeId,
                           @PathParam("id") final Integer roomId,
                           DevbridgeRoomDTO roomDTO) {
        Room room = roomsDAO.findById(roomId);
        if (room == null) return Response.status(Response.Status.NOT_FOUND).build();
        DevBridgeRoom devRoom = devbridgeRoomsDAO.findById(room.getId());
        if (devRoom == null) return Response.status(Response.Status.NOT_FOUND).build();
        Integer roomNumber = roomDTO.getRoomNumber();
        if (roomNumber == null) return Response.status(Response.Status.BAD_REQUEST).build();

        devRoom.setRoomNumber(roomNumber);
        devbridgeRoomsDAO.update(devRoom);
        return Response.ok().build();
    }

    @Path("/{id}")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("apartmentId") final Integer apartmentId,
                           @PathParam("officeId") final Integer officeId,
                           @PathParam("id") final Integer roomId) {
        Room room = roomsDAO.findById(roomId);
        if (room == null) return Response.status(Response.Status.NOT_FOUND).build();
        DevBridgeRoom devRoom = devbridgeRoomsDAO.findById(roomId);
        if (devRoom == null) return Response.status(Response.Status.NOT_FOUND).build();

        devbridgeRoomsDAO.delete(devRoom);
        return Response.ok().build();
    }
}
