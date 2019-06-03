package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.File;
import java.io.Serializable;

@Entity
@Table(name = "HOTEL_ROOM")
@Getter @Setter
@EqualsAndHashCode(of = "room")
public class HotelRoom implements Serializable {

    public HotelRoom(){}

    @Id
    @ManyToOne
    @JoinColumn(name = "ROOM_ID")
    private Room room;

    private Float price;

    @Column(name = "FILENAME")
    private String filename;
}