export function isControlListComplete(controlList) {
    return (!controlList.isCarRequired || controlList.isCarRented) &&
                (!controlList.areTicketsRequired || controlList.areTicketsBought) &&
                (!controlList.isAccommodationRequired || controlList.isAccommodationRented);
}
