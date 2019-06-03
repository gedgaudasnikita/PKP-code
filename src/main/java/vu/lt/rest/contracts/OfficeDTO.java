package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Office;

@Getter @Setter
public class OfficeDTO {

    private Integer id;

    private String address;

    private String name;

    public static OfficeDTO officeToOfficeDTO(Office office) {
        if (office == null) {
            return null;

        }
        OfficeDTO officeDTO = new OfficeDTO();
        officeDTO.setId(office.getId());
        officeDTO.setAddress(office.getAddress());
        officeDTO.setName(office.getName());
        return officeDTO;
    }
}
