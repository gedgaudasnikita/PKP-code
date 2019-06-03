package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.io.File;

@Getter @Setter
public class CarDataDTO {

    private Integer id;

    private String model;

    private Integer capacity;

    private Float price;

    private String filename;
}
