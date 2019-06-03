package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.DevBridgeRoom;

@Getter @Setter
public class DevbridgeRoomDTO {

    private Integer id;

    private Integer roomNumber;

    private Integer devbridgeApartmentId;

    public static DevbridgeRoomDTO roomToDevbridgeRoomDTO(DevBridgeRoom room) {
        DevbridgeRoomDTO roomDTO = new DevbridgeRoomDTO();
        roomDTO.setId(room.getRoom().getId());
        roomDTO.setDevbridgeApartmentId(room.getDevBridgeApartment().getId());
        roomDTO.setRoomNumber(room.getRoomNumber());
        return roomDTO;
    }
}
