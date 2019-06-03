package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.DevBridgeApartment;

@Getter @Setter
public class DevbridgeApartmentDTO {

    private Integer id;

    private String address;

    private String name;

    private Integer officeId;

    public static DevbridgeApartmentDTO apartmentToApartmentDTO(DevBridgeApartment apartment) {
        DevbridgeApartmentDTO apartmentDTO = new DevbridgeApartmentDTO();
        apartmentDTO.setId(apartment.getId());
        apartmentDTO.setAddress(apartment.getAddress());
        apartmentDTO.setName(apartment.getName());
        apartmentDTO.setOfficeId(apartment.getOffice().getId());
        return apartmentDTO;
    }
}
