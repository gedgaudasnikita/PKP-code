package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Room;
import vu.lt.entities.UserTrip;

@Getter @Setter
public class UserTripDTO {

    private UserDTO user;

    private TripWithIdsDTO trip;

    private Integer carDataId;

    private Integer flightDataId;

    private Room room;

    private UserTrip.ParticipationStatus participationStatus;

    public static UserTripDTO userTripToUserTripDTO(UserTrip userTrip) {
        UserTripDTO userTripDTO = new UserTripDTO();
        userTripDTO.setUser(UserDTO.userToTripUserDTO(userTrip.getKey().getUser()));
        userTripDTO.setTrip(TripWithIdsDTO.tripToTripWithIdsDTO(userTrip.getKey().getTrip()));
        if(userTrip.getCarData() != null) {
            userTripDTO.setCarDataId(userTrip.getCarData().getId());
        }
        if(userTrip.getFlightData() != null) {
            userTripDTO.setFlightDataId(userTrip.getFlightData().getId());
        }
        if(userTrip.getRoom() != null) {
            userTripDTO.setRoom(userTrip.getRoom());
        }
        userTripDTO.setParticipationStatus(userTrip.getParticipationStatus());
        return userTripDTO;
    }
}
