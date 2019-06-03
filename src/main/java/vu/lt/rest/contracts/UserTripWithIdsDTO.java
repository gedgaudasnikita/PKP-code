package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserTripWithIdsDTO {

    private Integer userId;

    private Integer tripId;
}
