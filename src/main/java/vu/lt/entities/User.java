package vu.lt.entities;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "USER")
@Getter @Setter
@EqualsAndHashCode(of = "id")
public class User implements Serializable {

    public User() {}

    public enum Role {
        TRAVELLER,
        ORGANIZER,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;

    private String password;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "key.user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserTrip> userTrips = new ArrayList<>();

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.DETACH)
    private List<Trip> organizedTrips = new ArrayList<>();

    @OneToMany(mappedBy = "key.user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Availability> availability = new ArrayList<>();
}