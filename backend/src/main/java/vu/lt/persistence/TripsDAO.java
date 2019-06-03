package vu.lt.persistence;

import vu.lt.entities.Trip;
import vu.lt.rest.contracts.TripDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class TripsDAO {

    @Inject
    private EntityManager em;

    public void persist(Trip trip) {
        em.persist(trip);
        em.flush();
    }

    public Trip update(Trip trip) {
        return em.merge(trip);
    }

    public Trip findById(Integer id) {
        return em.find(Trip.class, id);
    }

    public void delete(Trip trip) {
        em.remove(trip);
    }

    public List<TripDTO> getAllTrips() {
        String  query = "SELECT t FROM Trip t";
        List<Trip> resultList = em.createQuery(query, Trip.class).getResultList();
        List<TripDTO> trips = new ArrayList<>();

        for(Trip trip : resultList) {
            trips.add(TripDTO.tripToTripDTO(trip));
        }
        return trips;
    }
}
