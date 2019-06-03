package vu.lt.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "USER_SESSION")
@Getter @Setter
@EqualsAndHashCode(of = "token")
public class UserSession implements Serializable {

    public UserSession(){}

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name="UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private String token;
}