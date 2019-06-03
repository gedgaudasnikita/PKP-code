package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.RandomString;
import vu.lt.entities.User;
import vu.lt.entities.UserSession;
import vu.lt.persistence.UserSessionDAO;
import vu.lt.persistence.UsersDAO;
import vu.lt.rest.contracts.AvailabilityDTO;
import vu.lt.rest.contracts.LoginDTO;
import vu.lt.rest.contracts.LoginResponseDTO;
import vu.lt.rest.contracts.UserDTO;
import vu.lt.services.INotificationSenderService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@ApplicationScoped
@Path("/login")
public class LoginController {
    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @Inject
    @Getter @Setter
    UserSessionDAO userSessionDAO;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response login(LoginDTO loginDTO) {
        try {
            User authenticatedUser = usersDAO.findUserByCredentials(loginDTO.getEmail(), loginDTO.getPassword());

            if (authenticatedUser == null) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }

            LoginResponseDTO response = new LoginResponseDTO();
            response.setUser(UserDTO.userToTripUserDTO(authenticatedUser));

            UserSession session = new UserSession();
            session.setUser(authenticatedUser);
            userSessionDAO.persist(session);
            response.setSession(session.getToken());

            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.serverError().build();
        }
    }
}
