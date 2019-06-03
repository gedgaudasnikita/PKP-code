package vu.lt.services;

import org.apache.commons.mail.*;
import vu.lt.entities.User;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import java.util.concurrent.Future;
import javax.ejb.*;

@Alternative
@ApplicationScoped
public class EmailNotificationSender implements INotificationSenderService {
    @Override
    @Asynchronous
    public Future<Boolean> sendNotification(User recipient, String notification) {
        try {
            Email email = new SimpleEmail();
            email.setHostName("smtp.gmail.com");
            email.setSmtpPort(465);
            email.setCharset("utf-8");
            email.setAuthenticator(new DefaultAuthenticator("cutlet.solutions@gmail.com", "cutletcutlet"));
            email.setSSLOnConnect(true);
            email.setFrom("cutlet.solutions@gmail.com");
            email.setSubject("DevBridge kelionių sistemos pranešimas");
            email.setMsg(notification);
            email.addTo(recipient.getEmail());
            email.send();
        } catch (Exception e) {
            System.out.println(e);
            return new AsyncResult<Boolean>(false);
        }

        return new AsyncResult<Boolean>(true);
    }
}
