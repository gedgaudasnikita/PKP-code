package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.File;
import java.io.Serializable;

@Entity
@Table(name = "CAR_DATA")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class CarData implements Serializable {

    public CarData(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String model;

    private Integer capacity;

    private Float price;

    @Column(name = "FILENAME")
    private String filename;
}