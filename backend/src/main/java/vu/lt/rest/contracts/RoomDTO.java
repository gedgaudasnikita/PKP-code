package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RoomDTO {

    private Integer id;

    private Boolean isDevbridgeRoom;

    private Integer roomNumber;

    private Integer devbridgeApartmentId;
}
