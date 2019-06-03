package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "USER_TRIP")
@Getter @Setter
@EqualsAndHashCode(of = "key")
public class UserTrip implements Serializable {

    public UserTrip(){}

    @EmbeddedId
    private UserTripKey key;

    public enum ParticipationStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "PARTICIPATION_STATUS")
    private ParticipationStatus participationStatus;

    @OneToOne
    @JoinColumn(name = "ROOM_ID")
    private Room room;

    @OneToOne
    @JoinColumn(name = "CAR_DATA_ID")
    private CarData carData;

    @OneToOne
    @JoinColumn(name = "FLIGHT_DATA_ID")
    private FlightData flightData;
}