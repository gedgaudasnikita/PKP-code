package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "OFFICE")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class Office implements Serializable {

    public Office(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String address;

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "office", orphanRemoval = true)
    private List<DevBridgeApartment> devBridgeApartments = new ArrayList<>();
}