package vu.lt.persistence;

import vu.lt.entities.HotelRoom;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;

@ApplicationScoped
public class HotelRoomsDAO {

    @Inject
    private EntityManager em;

    public HotelRoom findById(Integer id) {
        return em.find(HotelRoom.class, id);
    }

    public void persist(HotelRoom room) {
        em.persist(room);
    }
}
