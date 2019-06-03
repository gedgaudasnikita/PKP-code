package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Availability;
import vu.lt.entities.User;

import java.util.Date;

@Getter @Setter
public class AvailabilityDTO {

    private User user;

    private Date date;

    public static AvailabilityDTO AvailabilityToAvailabilityDTO (Availability availability) {

        AvailabilityDTO availabilityDTO = new AvailabilityDTO();

        availabilityDTO.setUser(availability.getKey().getUser());
        availabilityDTO.setDate(availability.getKey().getDate());

        return availabilityDTO;
    }
}


