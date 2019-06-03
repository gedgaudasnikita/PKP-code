package vu.lt.persistence;

import vu.lt.entities.CarData;
import vu.lt.entities.Trip;
import vu.lt.rest.contracts.TripDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class CarDataDAO {

    @Inject
    private EntityManager em;

    public void persist(CarData carData) {
        em.persist(carData);
    }

    public CarData update(CarData carData) {
        return em.merge(carData);
    }

    public CarData findById(Integer id) {
        return em.find(CarData.class, id);
    }

    public void delete(CarData carData) {
        em.remove(carData);
    }

    public List<CarData> getAll() {
        String  query = "SELECT c FROM CarData c";
        return em.createQuery(query, CarData.class).getResultList();
    }
}
