package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class TripMergingDTO {

//    {
//        tripToMergeId: 3,
//                conflicts: [
//        { user: { id: 1 },
//            mergedFlight: { Flight },
//            mergedCar: {Car},
//            mergedRoom: {Room} }
//  ]
//    }

    private Integer tripToMergeId;

    private List<ConflictDTO> conflicts;

    @Getter @Setter
    public static class ConflictDTO {
        private MergeUserDTO user;

        private FlightDataDTO mergedFlight;

        private CarDataDTO mergedCar;

        private UserTripRoomDTO mergedRoom;
    }

    @Getter @Setter
    public static class MergeUserDTO {
        private Integer id;
    }
}
