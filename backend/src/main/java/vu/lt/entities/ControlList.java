package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "CONTROL_LIST")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class ControlList implements Serializable {

    public ControlList(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "IS_CAR_REQUIRED")
    private Boolean isCarRequired;

    @Column(name = "IS_CAR_RENTED")
    private Boolean isCarRented;

    @Column(name = "IS_ACCOMMODATION_REQUIRED")
    private Boolean isAccommodationRequired;

    @Column(name = "IS_ACCOMMODATION_RENTED")
    private Boolean isAccommodationRented;

    @Column(name = "ARE_TICKETS_REQUIRED")
    private Boolean areTicketsRequired;

    @Column(name = "ARE_TICKETS_BOUGHT")
    private Boolean areTicketsBought;
}