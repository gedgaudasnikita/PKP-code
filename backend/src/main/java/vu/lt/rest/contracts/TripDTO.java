package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.ControlList;
import vu.lt.entities.Trip;
import vu.lt.entities.UserTrip;

import java.util.List;

@Getter @Setter
public class TripDTO {

    private Integer id;

    private String startDate;

    private String endDate;

    private OfficeDTO startOffice;

    private OfficeDTO endOffice;

    private UserDTO organizer;

    private ControlList controlList;

    private Boolean isCancelled;

    public static TripDTO tripToTripDTO(Trip trip) {
        TripDTO tripDTO = new TripDTO();
        tripDTO.setId(trip.getId());
        tripDTO.setStartDate(trip.getStartDate() != null ? trip.getStartDate().toString() : null);
        tripDTO.setEndDate(trip.getStartDate() != null ? trip.getEndDate().toString() : null);
        tripDTO.setStartOffice(OfficeDTO.officeToOfficeDTO(trip.getStartOffice()));
        tripDTO.setEndOffice(OfficeDTO.officeToOfficeDTO(trip.getEndOffice()));
        tripDTO.setOrganizer(UserDTO.userToTripUserDTO(trip.getOrganizer()));
        tripDTO.setControlList(trip.getControlList());
        tripDTO.setIsCancelled(trip.getIsCancelled());
        return tripDTO;
    }
}
