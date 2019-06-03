package vu.lt.interceptors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vu.lt.entities.User;
import vu.lt.rest.authentication.AuthenticatedUserRetriever;

import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.ws.rs.core.Response;
import java.io.Serializable;

@Interceptor
@AuthenticatedMethod
public class MethodAuthenticator implements Serializable{

    @Inject
    AuthenticatedUserRetriever userRetriever;

    @AroundInvoke
    public Object authenticateMethod(InvocationContext context) throws Exception {

        User user = userRetriever.getAuthenticatedUser();

        if(user == null){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        return context.proceed();
    }
}