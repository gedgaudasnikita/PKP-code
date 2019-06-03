package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DEVBRIDGE_APARTMENT")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class DevBridgeApartment implements Serializable {

    public DevBridgeApartment(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "OFFICE_ID")
    private Office office;

    @Column(unique = true)
    private String name;

    private String Address;

    @OneToMany(mappedBy = "devBridgeApartment", orphanRemoval = true)
    private List<DevBridgeRoom> devBridgeRooms = new ArrayList<>();
}
