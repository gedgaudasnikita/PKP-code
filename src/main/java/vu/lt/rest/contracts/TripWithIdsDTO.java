package vu.lt.rest.contracts;

import lombok.Getter;
import lombok.Setter;
import vu.lt.entities.Trip;

@Getter @Setter
public class TripWithIdsDTO {

    private Integer id;

    private String startDate;

    private String endDate;

    private Integer startOfficeId;

    private Integer endOfficeId;

    private Integer organizerId;

    private Boolean isCancelled;

    // attributes for a new control list
    private Boolean isAccommodationRequired;

    private Boolean isAccommodationRented;

    private Boolean isCarRequired;

    private Boolean isCarRented;

    private Boolean areTicketsRequired;

    private Boolean areTicketsBought;

    public static TripWithIdsDTO tripToTripWithIdsDTO(Trip trip) {
        TripWithIdsDTO tripWithIdsDTO = new TripWithIdsDTO();
        tripWithIdsDTO.setId(trip.getId());
        tripWithIdsDTO.setStartDate(trip.getStartDate().toString());
        tripWithIdsDTO.setEndDate(trip.getEndDate().toString());
        tripWithIdsDTO.setStartOfficeId(trip.getStartOffice() != null ? trip.getStartOffice().getId() : null);
        tripWithIdsDTO.setEndOfficeId(trip.getEndOffice() != null ? trip.getEndOffice().getId() : null);
        tripWithIdsDTO.setOrganizerId(trip.getOrganizer().getId());
        tripWithIdsDTO.setIsAccommodationRequired(trip.getControlList().getIsAccommodationRequired());
        tripWithIdsDTO.setIsAccommodationRented(trip.getControlList().getIsAccommodationRented());
        tripWithIdsDTO.setAreTicketsRequired(trip.getControlList().getAreTicketsRequired());
        tripWithIdsDTO.setAreTicketsBought(trip.getControlList().getAreTicketsBought());
        tripWithIdsDTO.setIsCarRequired(trip.getControlList().getIsCarRequired());
        tripWithIdsDTO.setIsCarRented(trip.getControlList().getIsCarRented());
        tripWithIdsDTO.setIsCancelled(trip.getIsCancelled());
        return tripWithIdsDTO;
    }
}
