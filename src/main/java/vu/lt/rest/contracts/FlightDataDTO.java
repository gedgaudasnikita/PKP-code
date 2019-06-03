package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.io.File;

@Getter @Setter
public class FlightDataDTO {
    private Integer id;

    private Float price;

    private String filename;
}
