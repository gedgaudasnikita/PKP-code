package vu.lt.persistence;

import vu.lt.entities.Availability;
import vu.lt.entities.User;
import vu.lt.rest.contracts.AvailabilityDTO;
import vu.lt.rest.contracts.UserDTO;
import vu.lt.services.INotificationSenderService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class UsersDAO {

    @Inject
    private EntityManager em;

    public void persist(User user) { em.persist(user); }

    public User update(User user) { return em.merge(user); }

    public User findById(Integer id){
        return em.find(User.class, id);
    }

    public void delete(User user) { em.remove(user); }

    public User findUserByCredentials(String email, String password) {
        String query = "SELECT u FROM User u WHERE u.email = :email AND u.password = :password";
        List<User> resultList = em.createQuery(query, User.class).setParameter("password", password).setParameter("email", email).getResultList();

        if (resultList.size() == 0) {
            return null;
        }

        return resultList.get(0);
    }

    public List<UserDTO> getAllUsers () {
        String query = "SELECT u FROM User u";
        List<User> resultList = em.createQuery(query, User.class).getResultList();
        List<UserDTO> users = new ArrayList<>();

        for (User user : resultList) {
            users.add(UserDTO.userToTripUserDTO(user));
        }
        return users;
    }

    public List<AvailabilityDTO> getAllAvailability (User user) {
        List<AvailabilityDTO> availabilityList = new ArrayList<>();

        for (Availability availability : user.getAvailability())
            availabilityList.add(AvailabilityDTO.AvailabilityToAvailabilityDTO(availability));

        return availabilityList;
    }
}
