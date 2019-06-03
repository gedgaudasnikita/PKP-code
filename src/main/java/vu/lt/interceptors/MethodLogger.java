package vu.lt.interceptors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vu.lt.entities.User;
import vu.lt.rest.authentication.AuthenticatedUserRetriever;

import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import java.io.Serializable;

@Interceptor
@LoggedInvocation
public class MethodLogger implements Serializable{
    private static final Logger LOG = LoggerFactory.getLogger(MethodLogger.class);
    private static final String LOG_TEMPLATE = "Username: %s, Role: %s, Class: %s, Method: %s";

    @Inject
    AuthenticatedUserRetriever userRetriever;

    @AroundInvoke
    public Object logMethodInvocation(InvocationContext context) throws Exception {

        String username;
        String role;
        User user = userRetriever.getAuthenticatedUser();

        if(user != null){
            username = user.getName();
            role = user.getRole().name();
        }
        else{
            username = "unknown";
            role = "unknown";
        }

        LOG.info(String.format(LOG_TEMPLATE, username, role, context.getTarget().getClass().getSimpleName(),context.getMethod().getName()));
        return context.proceed();
    }
}