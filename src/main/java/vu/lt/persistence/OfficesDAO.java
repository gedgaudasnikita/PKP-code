package vu.lt.persistence;

import vu.lt.entities.Office;
import vu.lt.rest.contracts.OfficeDTO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class OfficesDAO {

    @Inject
    private EntityManager em;

    public Office findById(Integer id) {
        return em.find(Office.class, id);
    }

    public void persist(Office office) {
        em.persist(office);
    }

    public Office update(Office office) {
        return em.merge(office);
    }

    public void delete(Office office) { em.remove(office); }

    public List<OfficeDTO> getAllOffices() {
        String  query = "SELECT o FROM Office o";
        List<Office> resultList = em.createQuery(query, Office.class).getResultList();
        List<OfficeDTO> offices = new ArrayList<>();

        for(Office office : resultList) {
            offices.add(OfficeDTO.officeToOfficeDTO(office));
        }
        return offices;
    }
}
