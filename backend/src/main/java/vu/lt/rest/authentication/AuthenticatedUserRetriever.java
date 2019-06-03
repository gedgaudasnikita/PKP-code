package vu.lt.rest.authentication;

import vu.lt.entities.User;
import vu.lt.entities.UserSession;
import vu.lt.persistence.UserSessionDAO;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;

@ApplicationScoped
public class AuthenticatedUserRetriever {

    @Context
    HttpHeaders httpHeaders;

    @Inject
    UserSessionDAO userSessionDAO;

    @Produces @Named @AuthenticatedUser
    public User getAuthenticatedUser() {
        String token = httpHeaders.getHeaderString("Authorization");

        UserSession session = userSessionDAO.findById(token);

        if (session == null) {
            return null;
        }

        return session.getUser();
    }
}
