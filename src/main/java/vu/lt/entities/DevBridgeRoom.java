package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "DEVBRIDGE_ROOM")
@Getter @Setter
@EqualsAndHashCode(of = "room")
public class DevBridgeRoom implements Serializable {

    public DevBridgeRoom(){}

    @Id
    @ManyToOne
    @JoinColumn(name = "ROOM_ID")
    private Room room;

    @Column(name = "ROOM_NUMBER")
    private Integer roomNumber;

    @ManyToOne
    @JoinColumn(name = "DEVBRIDGE_APARTMENT_ID")
    private DevBridgeApartment devBridgeApartment;
}