package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.io.File;

@Getter @Setter
public class UserTripRoomDTO {
    private Integer roomId;

    private Integer apartmentId;

    private Boolean isDevbridgeRoom;

    // fields for hotel room
    private String filename;

    private Float price;
}
