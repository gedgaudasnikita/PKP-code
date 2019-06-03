package vu.lt.persistence;

import vu.lt.entities.DevBridgeRoom;
import vu.lt.rest.contracts.DevbridgeRoomDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class DevbridgeRoomsDAO {

    @Inject
    private EntityManager em;

    public DevBridgeRoom findById(Integer id) {
        return em.find(DevBridgeRoom.class, id);
    }

    public void persist(DevBridgeRoom room) {
        em.persist(room);
    }

    public DevBridgeRoom update(DevBridgeRoom room) {
        return em.merge(room);
    }

    public void delete(DevBridgeRoom room) {
        em.remove(room);
    }

    public List<DevbridgeRoomDTO> getAllRoomsOfApartment(Integer apartmentId) {
        String query = "SELECT d FROM DevBridgeRoom d WHERE d.devBridgeApartment.id = :apartmentId";
        List<DevBridgeRoom> resultList = em.createQuery(query, DevBridgeRoom.class).setParameter("apartmentId", apartmentId).getResultList();
        List<DevbridgeRoomDTO> rooms = new ArrayList<>();

        for(DevBridgeRoom room : resultList) {
            rooms.add(DevbridgeRoomDTO.roomToDevbridgeRoomDTO(room));
        }
        return rooms;
    }
}
