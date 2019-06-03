package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.File;
import java.io.Serializable;

@Entity
@Table(name = "FLIGHT_DATA")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class FlightData implements Serializable {

    public FlightData(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "FILENAME")
    private String filename;

    private Float price;
}