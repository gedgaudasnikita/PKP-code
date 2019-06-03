package vu.lt.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.Date;

@Getter @Setter
@Embeddable
@EqualsAndHashCode
public class AvailabilityKey implements Serializable {

    public AvailabilityKey () {}

    public AvailabilityKey (User user, Date date) {
        this.user = user;
        this.date = date;
    }

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "DATE", nullable = false)
    private Date date;
}
