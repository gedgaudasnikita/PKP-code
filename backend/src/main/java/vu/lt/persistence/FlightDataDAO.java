package vu.lt.persistence;


import vu.lt.entities.CarData;
import vu.lt.entities.FlightData;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;

@ApplicationScoped
public class FlightDataDAO {
    @Inject
    private EntityManager em;

    public void persist(FlightData flightData) {
        em.persist(flightData);
    }

    public FlightData update(FlightData flightData) {
        return em.merge(flightData);
    }

    public FlightData findById(Integer id) {
        return em.find(FlightData.class, id);
    }

    public void delete(FlightData flightData) {
        em.remove(flightData);
    }

    public List<FlightData> getAll() {
        String  query = "SELECT c FROM FlightData c";
        return em.createQuery(query, FlightData.class).getResultList();
    }
}
