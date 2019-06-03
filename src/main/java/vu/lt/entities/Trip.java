package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "TRIP")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class Trip implements Serializable {

    public Trip(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "START_DATE")
    private Date startDate;

    @Column(name = "END_DATE")
    private Date endDate;

    @Version
    @Column(name = "OPT_LOCK_VERSION")
    private Integer version;

    @ManyToOne
    @JoinColumn(name = "START_OFFICE_ID")
    private Office startOffice;

    @ManyToOne
    @JoinColumn(name = "END_OFFICE_ID")
    private Office endOffice;

    @ManyToOne
    @JoinColumn(name = "ORGANIZER_ID")
    private User organizer;

    @OneToOne
    @JoinColumn(name = "CONTROL_LIST_ID")
    private ControlList controlList;

    @OneToMany(mappedBy = "key.trip", orphanRemoval = true)
    private List<UserTrip> userTrips = new ArrayList<>();

    @Column(name = "IS_CANCELLED")
    private Boolean isCancelled = false;
}