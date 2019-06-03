package vu.lt.entities;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "AVAILABILITY")
@Getter @Setter
@EqualsAndHashCode
public class Availability implements Serializable {

    public Availability() {}

    @EmbeddedId
    private AvailabilityKey key;
}
