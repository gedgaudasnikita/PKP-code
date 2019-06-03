package vu.lt.services;

import vu.lt.entities.User;

import javax.ejb.Asynchronous;
import java.util.concurrent.Future;

public interface INotificationSenderService {
    @Asynchronous
    public Future<Boolean> sendNotification(User recipient, String notification);
}
