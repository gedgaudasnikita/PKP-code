package vu.lt.rest;

import lombok.Getter;
import lombok.Setter;
import vu.lt.RandomString;
import vu.lt.entities.User;
import vu.lt.interceptors.AuthenticatedMethod;
import vu.lt.interceptors.LoggedInvocation;
import vu.lt.persistence.UsersDAO;
import vu.lt.rest.contracts.AvailabilityDTO;
import vu.lt.rest.contracts.UserDTO;
import vu.lt.services.INotificationSenderService;
import javax.enterprise.context.RequestScoped;
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

@RequestScoped
@Path("/users")
public class UserController {
    @Inject
    @Getter @Setter
    UsersDAO usersDAO;

    @Inject
    private INotificationSenderService notificationSenderService;

    @LoggedInvocation
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        List<UserDTO> users = usersDAO.getAllUsers();
        return Response.ok(users).build();
    }

    @LoggedInvocation
    @Path("/{id}")
    @AuthenticatedMethod
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("id") final Integer id) {
        User user = usersDAO.findById(id);
        if (user == null) return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(UserDTO.userToTripUserDTO(user)).build();
    }

    @LoggedInvocation
    @POST
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response create(UserDTO userDTO) {
        User.Role role = userDTO.getRole();
        String name = userDTO.getName();
        String email = userDTO.getEmail();

        RandomString gen = new RandomString(8);
        String pass = gen.nextString();

        //Doesn't check for unique emails ATM, will crash if you post with same emails
        //Also, seems to crash if you give it an empty JSON as well
        if (!areParamsValid(role, name, email)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        User newUser = buildUser(new User(), role, name, email, pass);

        usersDAO.persist(newUser);

        notificationSenderService.sendNotification(newUser, "Jums buvo sukurta paskyra DevBridge kelionių sistemoje. Jūsų slaptažodis: " + pass);

        return Response.ok().build();
    }

    @LoggedInvocation
    @Path("/{id}")
    @PUT
    @AuthenticatedMethod
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response update(@PathParam("id") final Integer userId, UserDTO userDTO)
    {
        User existingUser = usersDAO.findById(userId);
        //Made the same way as TripController, but shouldn't just create new user?
        if (existingUser == null) return Response.status(Response.Status.NOT_FOUND).build();

        User userToUpdate = updateUser(existingUser, userDTO);
        if (userToUpdate == null) return Response.status(Response.Status.BAD_REQUEST).build();

        usersDAO.update(userToUpdate);

        return Response.ok().build();
    }

    @LoggedInvocation
    @Path("/{id}")
    @DELETE
    @AuthenticatedMethod
    @Transactional
    public Response delete(@PathParam("id") final Integer userId) {
        User existingUser = usersDAO.findById(userId);
        if (existingUser == null) return Response.status(Response.Status.NOT_FOUND).build();

        usersDAO.delete(existingUser);
        return Response.ok().build();
    }

    @LoggedInvocation
    @Path("/{id}/availability")
    @GET
    @AuthenticatedMethod
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAvailability(@PathParam("id") final Integer userId,
                                    @DefaultValue("0001-01-01") @QueryParam("fromDate") String fromDateString,
                                    @DefaultValue("9999-01-01") @QueryParam("toDate") String toDateString) {

        User user = usersDAO.findById(userId);
        if (user == null) return Response.status(Response.Status.NOT_FOUND).build();
        Date fromDate;
        Date toDate;

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
        try {
            fromDate = format.parse(fromDateString);
            toDate = format.parse(toDateString);
        } catch (ParseException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        List<AvailabilityDTO> availabilityList = usersDAO.getAllAvailability(user);
        List<String> availabilityBetweenDates = new ArrayList<>();
        for (AvailabilityDTO availability : availabilityList) {
            if (availability.getDate().after(fromDate) && availability.getDate().before(toDate)) {
                availabilityBetweenDates.add(format.format(availability.getDate()));
            }
        }

        return Response.ok(availabilityBetweenDates).build();
    }

    private Boolean areParamsValid(User.Role role, String name, String email) {
        Boolean paramsOK = role != null && name != null && email != null;

        return paramsOK;
    }

    private User buildUser(User user, User.Role role, String name, String email, String pass) {
        user.setRole(role);
        user.setName(name);
        user.setEmail(email);
        user.setPassword(pass);
        return user;
    }

    private User updateUser(User existingUser, UserDTO userDTO){
        User.Role role = userDTO.getRole();
        String name = userDTO.getName();
        String email = userDTO.getEmail();

        if (!areParamsValid(role, name, email)) return null;

        existingUser.setRole(role);
        existingUser.setName(name);
        existingUser.setEmail(email);

        return existingUser;
    }
}
