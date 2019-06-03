import UserRoles from '../../enums/user.roles';
import ParticipationStatuses from '../../enums/participation.statuses';
import uuid from 'uuid';
import _ from 'lodash';

import {
    getCurrentUser
} from '../user.service';

import axios from 'axios';         

const _backendState_ = {
    userAvailability: [
        {
            userId: 1,
            day: '2019-06-01'
        },
        {
            userId: 2,
            day: '2019-06-01'
        },
        {
            userId: 3,
            day: '2019-06-01'
        }
    ],
    rooms: [
        {
            apartmentId: 2,
            roomNumber: 1,
            id: 1
        }
    ],
    apartments: [
        {
            id: 2,
            name: 'Chicago flat #1',
            address: 'Chicago Central Sq 1',
            officeId: 2
        }
    ],
    offices: [
        {
            id: 1,
            name: 'Vilnius'
        },
        {
            id: 2,
            name: 'Chicago'
        }
    ],
    users: [
        {
            id: 1,
            email: 'admin@cutlet.com', 
            password: 'admin', 
            name: 'Admin Istratorius',
            level: UserRoles.ADMIN
        },
        {
            id: 2,
            email: 'organize@cutlet.com', 
            password: 'organize', 
            name: 'Organiz Atorius',
            level: UserRoles.ORGANIZER
        },
        {
            id: 3,
            email: 'travel@cutlet.com', 
            password: 'travel', 
            name: 'Keli Autojas',
            level: UserRoles.TRAVELLER
        },
    ],
    trips: [
        {
            controlList: {
                isCarRequired: true,
                isCarRented: true,
                areTicketsRequired: true,
                areTicketsBought: true,
                isAccommodationRequired: true,
                isAccommodationRented: false,
            },
            id: 1,
            startDate: '2019-06-01T00:00:00Z',
            endDate: '2019-06-09T00:00:00Z',
            startOffice: {
                id: 1,
                name: 'Vilnius'
            },
            endOffice: {
                id: 2,
                name: 'Chicago'
            },
            organizer: {
                id: 2,
                email: 'organize@cutlet.com',
                name: 'Organiz Atorius', 
                level: UserRoles.ORGANIZER
            },
            car: [{
                id: 1,
                driver: {
                    id: 1
                },
                model: 'Macan',
                capacity: 2,
                price: 15000,
                filename: 'macan.pdf'
            }],
            flight: [{
                id: 1,
                passenger: {
                    id: 1
                },
                price: 3000,
                filename: 'sas.pdf'
            }],
            isCancelled: false,
            room: [
                {
                    id: 1,
                    isDevBridgeRoom: false,
                    guest: {
                        id: 1
                    },
                    price: 3000,
                    filename: 'booking.pdf'
                },
                {
                    id: 2,
                    isDevBridgeRoom: true,
                    guest: {
                        id: 2
                    },
                    roomId: 1,
                    apartment: {
                        id: 2,
                        name: 'Chicago flat #1',
                        address: 'Chicago Central Sq 1'
                    }
                }
            ],
            participation: [
                {
                    user: {
                        id: 1,
                        email: 'admin@cutlet.com', 
                        name: 'Admin Istratorius',
                        level: UserRoles.ADMIN
                    },
                    participationStatus: ParticipationStatuses.ACCEPTED
                },
                {
                    user: {
                        id: 2,
                        email: 'organize@cutlet.com', 
                        name: 'Organiz Atorius',
                        level: UserRoles.ORGANIZER
                    },
                    participationStatus: ParticipationStatuses.REJECTED
                },
                {
                    user: {
                        id: 3,
                        email: 'travel@cutlet.com', 
                        name: 'Keli Autojas',
                        level: UserRoles.TRAVELLER
                    },
                    participationStatus: ParticipationStatuses.PENDING
                }
            ]
        },
        {
            controlList: {
                isCarRequired: true,
                isCarRented: true,
                areTicketsRequired: true,
                areTicketsBought: true,
                isAccommodationRequired: true,
                isAccommodationRented: true,
            },
            id: 2,
            startDate: '2019-06-01T00:00:00Z',
            endDate: '2019-06-09T00:00:00Z',
            endOffice: {
                id: 2,
                name: 'Chicago'
            },
            startOffice: {
                id: 1,
                name: 'Vilnius'
            },
            isCancelled: true,
            organizer: {
                id: 1,
                email: 'admin@cutlet.com',
                name: 'Admin Istratorius', 
                level: UserRoles.ADMIN
            },
            car: [{
                id: 1,
                driver: {
                    id: 2
                },
                model: 'Macan',
                capacity: 2,
                price: 15000,
                filename: 'macan.pdf'
            }],
            flight: [{
                id: 1,
                passenger: {
                    id: 2
                },
                price: 3000,
                filename: 'sas.pdf'
            }],
            room: [
                {
                    id: 1,
                    isDevBridgeRoom: false,
                    guest: {
                        id: 2
                    },
                    price: 3000,
                    filename: 'booking.pdf'
                }
            ],
            participation: [
                {
                    user: {
                        id: 2,
                        email: 'organize@cutlet.com', 
                        name: 'Organiz Atorius',
                        level: UserRoles.ORGANIZER
                    },
                    participationStatus: ParticipationStatuses.REJECTED
                }
            ]
        }
    ]
}

localStorage.setItem('_backendState_', JSON.stringify(_backendState_));

function addUser(user) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    _backendState_.users.push({
        id: Math.max(
                ..._backendState_.users.map(({id}) => id)
            ) + 1,
        ...user
    });

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyUser(userId, newUser) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const index = _backendState_.users.findIndex(
        ({ id }) => userId === id
    );

    _backendState_.users[index] = {
        ..._backendState_.users[index],
        ...newUser
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteUser(userId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const index = _backendState_.users.findIndex(
        ({ id }) => userId === id
    );

    _backendState_.users.splice(index, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function getUserAvailability(id) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    return _backendState_.userAvailability.filter(({ userId }) => userId === id);
}

function getUsers() {
   const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
   return _backendState_.users;
}

function loginUser(email, password) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    return {
        user: _backendState_.users.find(
            (testUser) => 
                testUser.email === email &&
                testUser.password === password
        ),
        session: 'nothing'
    }
}

function resetPassword(userId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const index = _backendState_.users.findIndex(
        ({ id }) => userId === id
    );

    _backendState_.users[index].password = uuid();

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function getTrips(organizerId, travellerId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    const allTrips = _backendState_.trips;

    let filteredTrips = allTrips;
    if (organizerId) {
        filteredTrips = filteredTrips.filter(({ organizer }) => organizer.id === organizerId);
    }
    if (travellerId) {
        filteredTrips = filteredTrips.filter(({ participation }) => participation.find(({ user }) => user.id === travellerId));
    }

    return filteredTrips;
}

function getTrip(tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    return _backendState_.trips.find(({ id }) => id === parseInt(tripId));
}

function acceptTrip(tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const user = getCurrentUser();

    const tripIndex = _backendState_.trips.findIndex(({ id }) => id === tripId);
    
    const participationIndex = _backendState_.trips[tripIndex].participation.findIndex(({ user: { id } }) => id === user.id);

    _backendState_.trips[tripIndex].participation[participationIndex].participationStatus = ParticipationStatuses.ACCEPTED;

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function rejectTrip(tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const user = getCurrentUser();

    const tripIndex = _backendState_.trips.findIndex(({ id }) => id === tripId);
    
    const participationIndex = _backendState_.trips[tripIndex].participation.findIndex(({ user: { id } }) => id === user.id);

    _backendState_.trips[tripIndex].participation[participationIndex].participationStatus = ParticipationStatuses.REJECTED;

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function getCarFile(tripId, userId) {
    return axios.get('http://www3.nd.edu/~fboze/pdftest/test.pdf', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        }
    });
}

function getRoomFile(tripId, userId) {
    return axios.get('http://www3.nd.edu/~fboze/pdftest/test.pdf', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        }
    });
}

function getFlightFile(tripId, userId) {
    return axios.get('http://www3.nd.edu/~fboze/pdftest/test.pdf', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        }
    });
}

function deleteCarDataFile(tripId, userId) {
    return;
}

function deleteRoomDataFile(tripId, userId) {
    return;
}

function deleteFlightDataFile(tripId, userId) {
    return;
}

function uploadCarFile(tripId, userId, content) {
    return;
}

function uploadRoomFile(tripId, userId, content) {
    return;
}

function uploadFlightFile(tripId, userId, content) {
    return;
}

function modifyTrip(tripId, newTrip) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    const index = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    _backendState_.trips[index] = {
        ..._backendState_.trips[index],
        ...newTrip
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function createTrip(newTrip) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const createdTrip = {
        id: Math.max(
                ..._backendState_.users.map(({id}) => id)
            ) + 1,
        ...newTrip
    };

    _backendState_.trips.push(createdTrip);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
    return createdTrip;
}

function getOffices() {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    return _backendState_.offices;
}

function createOffice(newOffice) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const createdOffice = {
        id: Math.max(
                ..._backendState_.offices.map(({id}) => id)
            ) + 1,
        ...newOffice
    };

    _backendState_.offices.push(createdOffice);
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyOffice(officeId, newOffice) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const officeIndex = _backendState_.offices.findIndex(
        ({ id }) => id === officeId
    );

    _backendState_.offices[officeIndex] = {
        ..._backendState_.offices[officeIndex],
        ...newOffice
    };
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteOffice(officeId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const officeIndex = _backendState_.offices.findIndex(
        ({ id }) => id === officeId
    );

    _backendState_.offices.splice(officeIndex, 1);
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function getApartments(officeId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    let filteredApartments = _backendState_.apartments;

    if (officeId) {
        filteredApartments = filteredApartments.filter((apartment) => apartment.officeId === officeId);
    }

    return filteredApartments;
}

function createApartment(newApartment) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const createdApartment = {
        id: Math.max(
                ..._backendState_.apartments.map(({id}) => id)
            ) + 1,
        ...newApartment
    };

    _backendState_.apartments.push(createdApartment);
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyApartment(apartmentId, newApartment) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const apartmentIndex = _backendState_.apartments.findIndex(
        ({ id }) => id === apartmentId
    );

    _backendState_.apartments[apartmentIndex] = {
        ..._backendState_.apartments[apartmentIndex],
        ...newApartment
    };
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteApartment(apartmentId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const apartmentIndex = _backendState_.apartments.findIndex(
        ({ id }) => id === apartmentId
    );

    _backendState_.apartments.splice(apartmentIndex, 1);
    
    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyRoomData(tripId, userId, room) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const roomIndex = _backendState_.trips[tripIndex].room.findIndex(
        ({ guest }) => userId === guest.id
    );

    _backendState_.trips[tripIndex].room[roomIndex] = {
        ..._backendState_.trips[tripIndex].room[roomIndex],
        ...room
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteRoomData(userId, tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const roomIndex = _backendState_.trips[tripIndex].room.findIndex(
        ({ guest }) => userId === guest.id
    );

    _backendState_.trips[tripIndex].room.splice(roomIndex, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function createRoomData(tripId, userId, newTrip) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    _backendState_.trips[tripIndex].room.push({
        guest: { id: userId },
        ...newTrip
    });

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyCarData(tripId, userId, car) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const carIndex = _backendState_.trips[tripIndex].car.findIndex(
        ({ driver }) => userId === driver.id
    );

    _backendState_.trips[tripIndex].car[carIndex] = {
        ..._backendState_.trips[tripIndex].car[carIndex],
        ...car
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteCarData(userId, tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const carIndex = _backendState_.trips[tripIndex].car.findIndex(
        ({ driver }) => userId === driver.id
    );

    _backendState_.trips[tripIndex].car.splice(carIndex, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function createCarData(tripId, userId, newTrip) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    _backendState_.trips[tripIndex].car.push({
        guest: { id: userId },
        ...newTrip
    });

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyFlightData(tripId, userId, flight) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const flightIndex = _backendState_.trips[tripIndex].flight.findIndex(
        ({ passenger }) => userId === passenger.id
    );

    _backendState_.trips[tripIndex].flight[flightIndex] = {
        ..._backendState_.trips[tripIndex].flight[flightIndex],
        ...flight
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteFlightData(userId, tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const flightIndex = _backendState_.trips[tripIndex].flight.findIndex(
        ({ passenger }) => userId === passenger.id
    );

    _backendState_.trips[tripIndex].flight.splice(flightIndex, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteTrip(tripId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    _backendState_.trips.splice(tripIndex, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function createFlight(tripId, userId, newFlight) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    _backendState_.trips[tripIndex].flight.push({
        passenger: { id: userId },
        ...newFlight
    });

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function removeParticipant(tripId, participantId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));
    
    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );
    
    const participationIndex = _backendState_.trips[tripIndex].participation.findIndex(
        ({ user }) => participantId === user.id
    );

    _backendState_.trips[tripIndex].participation.splice(participationIndex, 1);

    const flightIndex = _backendState_.trips[tripIndex].flight.findIndex(
        ({ passenger }) => participantId === passenger.id
    );

    _backendState_.trips[tripIndex].flight.splice(flightIndex, 1);

    
    const carIndex = _backendState_.trips[tripIndex].car.findIndex(
        ({ driver }) => participantId === driver.id
    );

    _backendState_.trips[tripIndex].car.splice(carIndex, 1);

    
    const roomIndex = _backendState_.trips[tripIndex].room.findIndex(
        ({ guest }) => participantId === guest.id
    );

    _backendState_.trips[tripIndex].room.splice(roomIndex, 1);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function addParticipant(tripId, userId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const tripIndex = _backendState_.trips.findIndex(
        ({ id }) => tripId === id
    );

    const user = _backendState_.users.find(({ id }) => id === userId);

    _backendState_.trips[tripIndex].participation.push({
        user,
        participationStatus: ParticipationStatuses.PENDING
    });

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function mergeTrips(tripId, tripToMergeId, conflicts = []) {
    const tripToUpdate = _.cloneDeep(getTrip(tripId));
    const tripToMerge =  _.cloneDeep(getTrip(tripToMergeId));

    const resultingTrip = _.cloneDeep(tripToUpdate);
    resultingTrip.participation = tripToUpdate.participation.concat(tripToMerge.participation);
    resultingTrip.car = tripToUpdate.car.concat(tripToMerge.car);
    resultingTrip.flight = tripToUpdate.flight.concat(tripToMerge.flight);
    resultingTrip.room = tripToUpdate.room.concat(tripToMerge.room);
    
    //also resolve conflicts
    if (conflicts.length > 0) {
        resultingTrip.participation = _.uniqBy(resultingTrip.participation, 'user.id');
        resultingTrip.car = _.uniqBy(resultingTrip.car, 'driver.id');
        resultingTrip.flight = _.uniqBy(resultingTrip.flight, 'passenger.id');
        resultingTrip.room = _.uniqBy(resultingTrip.room, 'guest.id');

        conflicts.forEach((conflict) => {
            const targetRoomIndex = resultingTrip.room.findIndex(({ guest }) => guest.id === conflict.user.id);
            if (targetRoomIndex !== -1)
                resultingTrip.room[targetRoomIndex] = conflict.mergedRoom;
            const targetCarIndex = resultingTrip.car.findIndex(({ driver }) => driver.id === conflict.user.id);
            if (targetCarIndex !== -1)
                resultingTrip.car[targetCarIndex] = conflict.mergedCar;
            const targetFlightIndex = resultingTrip.flight.findIndex(({ passenger }) => passenger.id === conflict.user.id);
            if (targetFlightIndex !== -1)
                resultingTrip.flight[targetFlightIndex] = conflict.mergedFlight;
        });
    }

    modifyTrip(tripId, resultingTrip);
    deleteTrip(tripToMergeId);
}

function getRooms(officeId, apartmentId, { freeFrom, freeTo } = {}) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    return _backendState_.rooms.filter((room) => room.apartmentId === apartmentId);
}

function createRoom(newRoom) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const createdRoom = {
        id: Math.max(
                ..._backendState_.rooms.map(({id}) => id)
            ) + 1,
        ...newRoom
    };

    _backendState_.rooms.push(createdRoom);

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function modifyRoom(roomId, newRoom) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const roomIndex = _backendState_.rooms.findIndex((room) => room.id === roomId);

    _backendState_.rooms[roomIndex] = {
        ..._backendState_.rooms[roomIndex],
        ...newRoom
    };

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

function deleteRoom(roomId) {
    const _backendState_ = JSON.parse(localStorage.getItem('_backendState_'));

    const roomIndex = _backendState_.rooms.findIndex((room) => room.id === roomId);

    _backendState_.rooms.splice(roomIndex, 1)

    localStorage.setItem('_backendState_', JSON.stringify(_backendState_));
}

export default {
    loginUser,
    addUser,
    modifyUser,
    deleteUser,
    getUsers,
    getUserAvailability,
    resetPassword,
    getTrips,
    getTrip,
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
    deleteTrip,
    getOffices,
    createOffice,
    modifyOffice,
    deleteOffice,
    getApartments,
    createApartment,
    modifyApartment,
    deleteApartment,
    removeParticipant,
    addParticipant,
    mergeTrips,
    getRooms,
    createRoom,
    deleteRoom,
    modifyRoom
};
