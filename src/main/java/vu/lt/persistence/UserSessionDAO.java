package vu.lt.persistence;

import vu.lt.entities.CarData;
import vu.lt.entities.UserSession;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;

@ApplicationScoped
public class UserSessionDAO {

    @Inject
    private EntityManager em;

    public void persist(UserSession userSession) {
        em.persist(userSession);
        //we need the generated token right after
        em.flush();
    }

    public UserSession findById(String token) {
        return em.find(UserSession.class, token);
    }
}
