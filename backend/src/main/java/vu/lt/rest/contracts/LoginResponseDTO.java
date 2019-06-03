package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.User;

@Getter @Setter
public class LoginResponseDTO {
    private UserDTO user;

    private String session;
}
