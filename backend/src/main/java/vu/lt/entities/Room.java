package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "ROOM")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class Room implements Serializable {

    public Room(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "IS_DEVBRIDGE_ROOM")
    private Boolean isDevBridgeRoom;
}
