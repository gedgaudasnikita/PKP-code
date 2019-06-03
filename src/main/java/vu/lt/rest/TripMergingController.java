package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.*;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.*;
import vu.lt.rest.contracts.*;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@LoggedInvocation
@RequestScoped
@Path("/trips/{tripId}/merge")
public class TripMergingController {

    @Inject
    @Getter @Setter
    TripsDAO tripsDAO;

    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @Inject
    @Getter @Setter
    UserTripsDAO userTripsDAO;

    @Inject
    @Getter @Setter
    RoomsDAO roomsDAO;

    @Inject
    @Getter @Setter
    DevbridgeRoomsDAO devbridgeRoomsDAO;

    @Inject
    @Getter @Setter
    HotelRoomsDAO hotelRoomsDAO;

    @Inject
    @Getter @Setter
    FlightDataDAO flightDataDAO;

    @Inject
    @Getter @Setter
    CarDataDAO carDataDAO;

    @Inject
    @Getter @Setter
    ControlListsDAO controlListsDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @AuthenticatedMethod
    @Transactional
    public Response merge(@PathParam("tripId") final Integer tripId,
                          TripMergingDTO tripMergingDTO) {
        Trip trip = tripsDAO.findById(tripId);
        if (trip == null) return Response.status(Response.Status.NOT_FOUND).build();

        Integer tripToMergeId = tripMergingDTO.getTripToMergeId();
        if (tripToMergeId == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Trip tripToMerge = tripsDAO.findById(tripToMergeId);
        if (tripToMerge == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        List<TripMergingDTO.ConflictDTO> conflicts = tripMergingDTO.getConflicts();

        for (UserTrip userTripToMerge : tripToMerge.getUserTrips()) {
            System.out.println("usertrip" + userTripToMerge.getKey().getUser().getId());
            User participantToMerge = userTripToMerge.getKey().getUser();

            UserTrip participation = null;
            for (UserTrip currentParticipation : trip.getUserTrips()) {
                if (currentParticipation.getKey().getUser().getId().equals(participantToMerge.getId())) {
                    participation = currentParticipation;
                    break;
                }
            }

            if (participation == null) {
                UserTrip newUserTrip = new UserTrip();
                newUserTrip.setKey(new UserTripKey(participantToMerge, trip));
                newUserTrip.setFlightData(userTripToMerge.getFlightData());
                newUserTrip.setRoom(userTripToMerge.getRoom());
                newUserTrip.setCarData(userTripToMerge.getCarData());
                newUserTrip.setParticipationStatus(userTripToMerge.getParticipationStatus());
                userTripsDAO.persist(newUserTrip);
                userTripToMerge.setRoom(null);
                userTripToMerge.setFlightData(null);
                userTripToMerge.setCarData(null);
                userTripsDAO.update(userTripToMerge);
                userTripsDAO.delete(userTripToMerge);
                break;
            }

            System.out.println("boo");
            System.out.println(participation);
            System.out.println(participation.getRoom());
            System.out.println(participation.getCarData());
            System.out.println(participation.getFlightData());
            TripMergingDTO.ConflictDTO conflict = null;
            for (TripMergingDTO.ConflictDTO currentConflict : conflicts) {
                if (currentConflict.getUser().getId().equals(participantToMerge.getId())) {
                    conflict = currentConflict;
                    break;
                }
            }

            if (conflict == null) return Response.status(Response.Status.BAD_REQUEST).build();

            participation.setParticipationStatus(UserTrip.ParticipationStatus.PENDING);

            CarDataDTO carDataDTO = conflict.getMergedCar();
            System.out.println(carDataDTO);
            if (carDataDTO != null) {
                if (carDataDTO.getId() == null) {
                    CarData carData = new CarData();
                    Float price = carDataDTO.getPrice();
                    String model = carDataDTO.getModel();
                    Integer capacity = carDataDTO.getCapacity();
                    if (price == null || model == null || capacity == null) return Response.status(Response.Status.BAD_REQUEST).build();
                    carData.setCapacity(conflict.getMergedCar().getCapacity());
                    carData.setModel(conflict.getMergedCar().getModel());
                    carData.setPrice(conflict.getMergedCar().getPrice());
                    carDataDAO.persist(carData);
                    participation.setCarData(carData);
                } else {
                    CarData carData = carDataDAO.findById(carDataDTO.getId());
                    participation.setCarData(carData);
                }
            } else {
                participation.setCarData(participation.getCarData());
            }

            FlightDataDTO flightDataDTO = conflict.getMergedFlight();
            System.out.println(flightDataDTO);
            if (flightDataDTO != null) {
                if (flightDataDTO.getId() == null) {
                    FlightData flightData = new FlightData();
                    Float price = conflict.getMergedFlight().getPrice();
                    if (price == null) return Response.status(Response.Status.BAD_REQUEST).build();
                    flightData.setPrice(price);
                    flightDataDAO.persist(flightData);
                    participation.setFlightData(flightData);
                } else {
                    FlightData flightData = flightDataDAO.findById(flightDataDTO.getId());
                    participation.setFlightData(flightData);
                }
            } else {
                participation.setFlightData(participation.getFlightData());
            }

            UserTripRoomDTO roomDTO = conflict.getMergedRoom();
            System.out.println(roomDTO);
            if (roomDTO != null) {
                if (roomDTO.getIsDevbridgeRoom() == null) return Response.status(Response.Status.BAD_REQUEST).build();
                if (roomDTO.getIsDevbridgeRoom()) { // DevbridgeRoom
                    Room room = roomsDAO.findById(roomDTO.getRoomId());
                    participation.setRoom(room);
                } else {                            // HotelRoom
                    if (roomDTO.getRoomId() != null) {  // existing HotelRoom
                        participation.setRoom(roomsDAO.findById(roomDTO.getRoomId()));
                    } else {                        // non-existing HotelRoom
                        Room newRoom = new Room();
                        newRoom.setIsDevBridgeRoom(false);
                        roomsDAO.persist(newRoom);
                        HotelRoom newHotelRoom = new HotelRoom();
                        newHotelRoom.setRoom(newRoom);
                        Float price = conflict.getMergedRoom().getPrice();
                        if (price == null) return Response.status(Response.Status.BAD_REQUEST).build();
                        newHotelRoom.setPrice(roomDTO.getPrice());
                        hotelRoomsDAO.persist(newHotelRoom);
                        participation.setRoom(newRoom);
                    }
                }
            }

            userTripsDAO.update(participation);
            userTripToMerge.setRoom(null);
            userTripToMerge.setFlightData(null);
            userTripToMerge.setCarData(null);
            userTripsDAO.update(userTripToMerge);
            userTripsDAO.delete(userTripToMerge);
        }

        tripToMerge.setUserTrips(new ArrayList<UserTrip>());
        tripsDAO.update(tripToMerge);
        tripsDAO.delete(tripToMerge);
        return Response.ok().build();
    }
}
