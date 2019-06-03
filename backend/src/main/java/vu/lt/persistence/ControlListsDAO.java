package vu.lt.persistence;

import vu.lt.entities.ControlList;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;

@ApplicationScoped
public class ControlListsDAO {

    @Inject
    private EntityManager em;

    public ControlList findById(Integer id) {
        return em.find(ControlList.class, id);
    }

    public void persist(ControlList list) {
        em.persist(list);
    }

    public ControlList update(ControlList list) {
        return em.merge(list);
    }

    public void delete(ControlList list) {
        em.remove(list);
    }
}
