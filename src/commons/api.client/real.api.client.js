import ParticipationStatuses from '../../enums/participation.statuses';

import {
    getCurrentUser
} from '../user.service';

import axios from 'axios';     

async function _makeRequest(uri, method, query, body, headers) {
    const url = window.backendUrl + uri;    

    let response;
    try {
        response = await axios({
            url,
            method,
            params: query,
            data: body,
            headers: {
                ...headers,
                'Authorization': getCurrentUser() ? getCurrentUser().authdata : ''
            }
        });
    } catch (e) {
        if (e.response && e.response.status === 401) {
            return global._authService.logout();
        } else {
            throw e;
        }
    }

    return response.data ? response.data : response;
}

function addUser(user) {
    return _makeRequest('/users', 'post', {}, user);
}

function modifyUser(userId, newUser) {
    return _makeRequest('/users/' + userId, 'put', {}, newUser);
}

function getUserAvailability(userId, fromDate, toDate) {
    const query = {};
    if (fromDate) {
        query.fromDate = fromDate;
    }
    if (toDate) {
        query.toDate = toDate;
    }

    return _makeRequest('/users/' + userId + '/availability', 'get', query);
}

function deleteUser(userId) {
    return _makeRequest('/users/' + userId, 'delete');
}

function getUsers() {
    return _makeRequest('/users', 'get');
}

function loginUser(email, password) {
    return _makeRequest('/login', 'post', {}, { email, password });    
}

function resetPassword(userId) {
    return;
}

async function getTrips(organizerId, travellerId) {
    const trips = await _makeRequest('/trips', 'get', { organizerId, travellerId });  
    
    const tripsWithParticipation = await Promise.all(
        trips.map(async (trip) => {
            const participation = await _makeRequest('/usertrips/' + trip.id + '/participants', 'get');
            
            return {
                ...trip,
                participation
            };
        })
    )

    return tripsWithParticipation;
}

async function getTrip(tripId) {
    const trip = await _makeRequest('/trips/' + tripId, 'get');
    const participation = await _makeRequest('/usertrips/' + tripId + '/participants', 'get');
    
    const car = await Promise.all(participation.map(async ({ user }) => {
        try {
        const car = await getCarData(user.id, tripId, );


        return {
            driver: user,
            ...car
        }
        } catch(e) {}
    }));
    
    const flight = await Promise.all(participation.map(async ({ user }) => {
        try {const flight = await getFlightData(user.id, tripId, );
            
        

        return {
            passenger: user,
            ...flight
        }} catch(e) {}
    }));

    const room = await Promise.all(participation.map(async({ user }) => {
        try {const room = await getRoomData( user.id, tripId);

        return {
            guest: user,
            ...room
        }} catch(e) {}
    }));

    return {
        ...trip,
        participation,
        room: room.filter(Boolean),
        car: car.filter(Boolean),
        flight: flight.filter(Boolean)
    };        
}

function deleteTrip(tripId) {
    return _makeRequest('/trips' + tripId, 'delete');    
}

function acceptTrip(tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + getCurrentUser().id, 'put', {}, {participationStatus: ParticipationStatuses.ACCEPTED});   
}

function rejectTrip(tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + getCurrentUser().id, 'put', {}, {participationStatus: ParticipationStatuses.REJECTED});      
}

function getCarFile(tripId, userId) {
    return  window.open(window.backendUrl+ '/usertrips/' + tripId + '/participants/' + userId + '/car/file', "_blank") 
}

function getRoomFile(tripId, userId) {
    return window.open(window.backendUrl + '/usertrips/' + tripId + '/participants/' + userId + '/room/file', "_blank") 
}

function getFlightFile(tripId, userId) {
    return window.open(window.backendUrl + '/usertrips/' + tripId + '/participants/' + userId + '/flight/file', "_blank") 
}

function deleteCarDataFile(tripId, userId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car/file', 'delete');     
}

function deleteRoomDataFile(tripId, userId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room/file', 'delete');     
}

function deleteFlightDataFile(tripId, userId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight/file', 'delete');     
}

function uploadCarFile(tripId, userId, content, filename) {
    let fd = new FormData();
    fd.append('file', content)
    fd.append('filename', filename)

    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car/file', 'post', {}, fd, {
        'Content-Type': 'multipart/form-data'
    });
}

function uploadRoomFile(tripId, userId, content, filename) {
    let fd = new FormData();
    fd.append('file', content)
    fd.append('filename', filename)

    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room/file', 'post', {}, fd, {
        'Content-Type': 'multipart/form-data'
    });
}

function uploadFlightFile(tripId, userId, content, filename) {
    let fd = new FormData();
    fd.append('file', content)
    fd.append('filename', filename)

    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight/file', 'post', {}, fd, {
        'Content-Type': 'multipart/form-data'
    });
}

function modifyTrip(tripId, newTrip) {
    return _makeRequest('/trips/' + tripId, 'put', {}, newTrip);
}

function createTrip(newTrip) {
    return _makeRequest('/trips', 'post', {}, newTrip);
}

function mergeTrips(tripId, tripToMergeId, conflicts) {
    return _makeRequest('/trips/' + tripId + '/merge', 'post', {}, {
        tripToMergeId,
        conflicts
    });
}

function getOffices() {
    return _makeRequest('/offices', 'get');    
}

async function getApartments(officeId) {
    if (officeId) {
        return _makeRequest('/offices/' + officeId + '/apartments', 'get');   
    } else {
        const offices = await getOffices();

        const apartments = await Promise.all(offices.map(({ id }) => getApartments(id)));

        return apartments.flat();
    }
}

function modifyRoomData(tripId, userId, room) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room', 'put', {}, room);    
}

function deleteRoomData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room', 'delete');  
}

function createRoomData(tripId, userId, newRoom) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room', 'post', {}, newRoom);    
}

function modifyCarData(tripId, userId, car) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car', 'put', {}, car);    
}

function deleteCarData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car', 'delete');    
}

function getCarData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car', 'get');    
}

function getFlightData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight', 'get');    
}

function getRoomData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/room', 'get');    
}

function createCarData(tripId, userId, newCar) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/car', 'post', {}, newCar);    
}

function modifyFlightData(tripId, userId, flight) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight', 'put', {}, flight);    
}

function deleteFlightData(userId, tripId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight', 'delete');  
}

function createFlight(tripId, userId, newFlight) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + userId + '/flight', 'post', {}, newFlight);  
}

function removeParticipant(tripId, participantId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + participantId, 'delete');      
}

function addParticipant(tripId, participantId) {
    return _makeRequest('/usertrips/' + tripId + '/participants/' + participantId, 'post');      
}

function getRooms(officeId, apartmentId, { freeFrom, freeTo } = {}) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId + '/rooms', 'get', {
        freeFrom,
        freeTo
    });  
}

function createOffice(newOffice) {
    return _makeRequest('/offices', 'post', {}, newOffice); 
}

function createApartment(officeId, newApartment) {
    return _makeRequest('/offices/' + officeId + '/apartments', 'post', {}, newApartment); 
}

function modifyOffice(officeId, newOffice) {
    return _makeRequest('/offices/' + officeId, 'put', {}, newOffice); 
}

function modifyApartment(officeId, apartmentId, newApartment) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId, 'put', {}, newApartment); 
}

function deleteOffice(officeId) {
    return _makeRequest('/offices/' + officeId, 'delete'); 
}

function deleteApartment(officeId, apartmentId) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId, 'delete'); 
}

function createRoom(officeId, apartmentId, room) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId + '/rooms', 'post', {}, room); 
}

function deleteRoom(officeId, apartmentId, roomId) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId + '/rooms/' + roomId, 'delete'); 
}

function modifyRoom(officeId, apartmentId, roomId, newRoom) {
    return _makeRequest('/offices/' + officeId + '/apartments/' + apartmentId + '/rooms/' + roomId, 'put', {}, newRoom); 
}


export default {
    loginUser,
    addUser,
    getUserAvailability,
    modifyUser,
    deleteUser,
    getUsers,
    resetPassword,
    getTrips,
    getTrip,
    deleteTrip,
    acceptTrip,
    rejectTrip,
    getCarFile,
    getRoomFile,
    modifyRoomData,
    deleteRoomData,
    createRoomData,
    modifyCarData,
    deleteCarData,
    createCarData,
    modifyFlightData,
    deleteFlightData,
    createFlight,
    getFlightFile,
    deleteCarDataFile,
    deleteRoomDataFile,
    deleteFlightDataFile,
    uploadCarFile,
    uploadRoomFile,
    uploadFlightFile,
    modifyTrip,
    createTrip,
    getOffices,
    getApartments,
    removeParticipant,
    addParticipant,
    mergeTrips,
    getRooms,
    createOffice,
    createApartment,
    modifyOffice,
    modifyApartment,
    deleteOffice,
    deleteApartment,
    createRoom,
    deleteRoom,
    modifyRoom
};
