package vu.lt.persistence;

import vu.lt.entities.UserTrip;
import vu.lt.entities.UserTripKey;
import vu.lt.rest.contracts.UserTripDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class UserTripsDAO {

    @Inject
    private EntityManager em;

    public void persist(UserTrip userTrip) {
        em.persist(userTrip);
    }

    public UserTrip update(UserTrip userTrip) {
        return em.merge(userTrip);
    }

    public UserTrip findByKey(UserTripKey key) {
        return em.find(UserTrip.class, key);
    }

    public void delete(UserTrip userTrip) {
        em.remove(userTrip);
    }

    public List<UserTripDTO> getUserTripsForTrip(Integer tripId) {
        String query = "SELECT u FROM UserTrip u WHERE u.key.trip.id = :tripId";
        List<UserTrip> resultList = em.createQuery(query, UserTrip.class).setParameter("tripId", tripId).getResultList();
        List<UserTripDTO> userTrips = new ArrayList<>();

        for(UserTrip userTrip : resultList) {
            userTrips.add(UserTripDTO.userTripToUserTripDTO(userTrip));
        }
        return userTrips;
    }
}
