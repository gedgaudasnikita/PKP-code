package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.User;

@Getter @Setter
public class UserDTO {

    private Integer id;

    private String name;

    private String email;

    private User.Role role;

    public static UserDTO userToTripUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        return userDTO;
    }
}
