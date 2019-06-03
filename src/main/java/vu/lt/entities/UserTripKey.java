package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Getter @Setter
@Embeddable
@EqualsAndHashCode
public class UserTripKey implements Serializable {

    public UserTripKey() {}

    public UserTripKey(User user, Trip trip) {
        this.user = user;
        this.trip = trip;
    }

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "TRIP_ID", nullable = false)
    private Trip trip;
}