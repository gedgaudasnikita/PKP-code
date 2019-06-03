package vu.lt.persistence;

import vu.lt.entities.Room;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;

@ApplicationScoped
public class RoomsDAO {

    @Inject
    private EntityManager em;

    public Room findById(Integer id) {
        return em.find(Room.class, id);
    }

    public void persist(Room room) {
        em.persist(room);
    }
}
