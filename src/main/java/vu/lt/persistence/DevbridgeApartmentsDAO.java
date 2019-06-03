package vu.lt.persistence;

import vu.lt.entities.DevBridgeApartment;
import vu.lt.rest.contracts.DevbridgeApartmentDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class DevbridgeApartmentsDAO {

    @Inject
    private EntityManager em;

    public DevBridgeApartment findById(Integer id) {
        return em.find(DevBridgeApartment.class, id);
    }

    public void persist(DevBridgeApartment apartment) {
        em.persist(apartment);
    }

    public DevBridgeApartment update(DevBridgeApartment apartment) {
        return em.merge(apartment);
    }

    public void delete(DevBridgeApartment apartment) {
        em.remove(apartment);
    }

    public List<DevbridgeApartmentDTO> getApartmentsForOffice(Integer officeId) {
        String query = "SELECT d FROM DevBridgeApartment d WHERE d.office.id = :officeId";
        List<DevBridgeApartment> resultList = em.createQuery(query, DevBridgeApartment.class).setParameter("officeId", officeId).getResultList();
        List<DevbridgeApartmentDTO> apartments = new ArrayList<>();

        for(DevBridgeApartment apartment : resultList) {
            apartments.add(DevbridgeApartmentDTO.apartmentToApartmentDTO(apartment));
        }
        return apartments;
    }
}
