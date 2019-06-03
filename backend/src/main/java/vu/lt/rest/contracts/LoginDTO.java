package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.User;

@Getter @Setter
public class LoginDTO {
    private String email;

    private String password;
}
