-- USER
INSERT INTO USER(email, name, password, role) VALUES ('johnny.doe@gmail.com', 'Johnny Doe', 'testing', 'ADMIN');
INSERT INTO USER(email, name, password, role) VALUES ('adriana.doe@gmail.com', 'Adriana Doe', 'testing', 'ORGANIZER');
INSERT INTO USER(email, name, password, role) VALUES ('jonas@gmail.com', 'Jonas Jonauskas', 'testing', 'TRAVELLER');
INSERT INTO USER(email, name, password, role) VALUES ('bitute@gmail.com', 'Birute Birutyte', 'testing', 'ORGANIZER');
INSERT INTO USER(email, name, password, role) VALUES ('antoske69@gmail.com', 'Antanas Antanaitis', 'testing', 'TRAVELLER');

-- CAR_DATA
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (5, null, 'Fiat Punto', 40.50);
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (2, null, 'Nissan GTR', 100.00);
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (5, null, 'Audi Bulka', 15.50);
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (7, null, 'Citroen Chebramobilis', 20.30);
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (2, null, 'Lamborghini Aventador', 200.99);
INSERT INTO CAR_DATA(capacity, filename, model, price) VALUES (5, null, 'BMW 330', 40.50);

-- OFFICE
INSERT INTO OFFICE(address, name) VALUES ('343 W. Erie St. Suite 600 Chicago, IL 60654 United States', 'Chicago');
INSERT INTO OFFICE(address, name) VALUES ('36 Toronto Street Suite 260 Toronto, Ontario M5C 2C5 Canada', 'Toronto');
INSERT INTO OFFICE(address, name) VALUES ('8 Devonshire Square London EC2M 4PL United Kingdom', 'London');
INSERT INTO OFFICE(address, name) VALUES ('11d. Juozapaviciaus pr. Kaunas, LT-45252 Lithuania', 'Kaunas');
INSERT INTO OFFICE(address, name) VALUES ('135 Zalgirio g. Vilnius, LT-08217 Lithuania', 'Vilnius');

-- DEVBRIDGE_APARTMENT
INSERT INTO DEVBRIDGE_APARTMENT(address, name, office_id) VALUES ('Chicago str. 45, Chicago', 'Chicago Apartment', 1);
INSERT INTO DEVBRIDGE_APARTMENT(address, name, office_id) VALUES ('Toronto str. 45, Toronto', 'Toronto Apartment', 2);
INSERT INTO DEVBRIDGE_APARTMENT(address, name, office_id) VALUES ('London str. 45, London', 'London Apartment', 3);
INSERT INTO DEVBRIDGE_APARTMENT(address, name, office_id) VALUES ('Kaunas str. 45, Kaunas', 'Kaunas Apartment', 4);
INSERT INTO DEVBRIDGE_APARTMENT(address, name, office_id) VALUES ('Vilnius str. 45, Vilnius', 'Vilnius Apartment', 5);

-- ROOM
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 1
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 2
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 3
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 4
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 5
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 6
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 7
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 8
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 9
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 10
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 11
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 12
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 13
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 14
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 15
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 16
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 17
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 18
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 19
INSERT INTO ROOM(is_devbridge_room) VALUES (true); -- 20
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 21
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 22
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 23
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 24
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 25
INSERT INTO ROOM(is_devbridge_room) VALUES (false); -- 26

-- DEVBRIDGE_ROOM
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (1, 1, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (2, 2, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (3, 3, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (4, 4, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (5, 5, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (6, 6, 1);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (1, 7, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (2, 8, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (3, 9, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (4, 10, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (5, 11, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (6, 12, 2);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (1, 13, 3);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (2, 14, 3);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (3, 15, 3);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (1, 16, 4);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (2, 17, 4);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (3, 18, 4);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (1, 19, 5);
INSERT INTO DEVBRIDGE_ROOM(room_number, room_id, devbridge_apartment_id) VALUES (2, 20, 5);

-- HOTEL_ROOM
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 25.00, 21);
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 30.00, 22);
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 15.00, 23);
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 30.00, 24);
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 32.00, 25);
INSERT INTO HOTEL_ROOM(filename, price, room_id) VALUES (null, 25.00, 26);

-- FLIGHT_DATA
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 100.00);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 123.00);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 150.00);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 423.00);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 159.00);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 156.50);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 456.78);
INSERT INTO FLIGHT_DATA(filename, price) VALUES (null, 258.47);

-- CONTROL_LIST                                                                                                                                  tickets, accommodation, car
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (true, true, false, false, false, false);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (false, true, true, true, false, false);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (false, true, false, false, true, true);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (false, true, true, true, false, false);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (false, true, false, false, true, true);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (false, true, true, true, false, false);
INSERT INTO CONTROL_LIST(are_tickets_bought, are_tickets_required, is_accommodation_rented, is_accommodation_required, is_car_rented, is_car_required) VALUES (true, true, true, true, false, false);

-- TRIP
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 1, 1, 2, 2, 0); -- 1
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 2, 2, 3, 4, 0); -- 2
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 3, 3, 2, 4, 0); -- 3
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 4, 2, 1, 2, 0); -- 4
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 5, 4, 3, 2, 0); -- 5
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 6, 1, 4, 4, 0); -- 6
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 7, 5, 3, 2, 0); -- 7
INSERT INTO TRIP(start_date, end_date, is_cancelled, control_list_id, start_office_id, end_office_id, organizer_id, opt_lock_version) VALUES ('2019-08-17', '2019-08-25', false, 3, 1, 2, 3, 0); -- 8

-- USER_TRIP                                                                                             status, user, trip, car_data, flight_data, room
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 1, 1, null, 1,    7   ); -- johnny.doe@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('PENDING',  1, 2, null, null, null); -- johnny.doe@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 1, 3, 1,    null, 7   ); -- johnny.doe@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('REJECTED', 2, 1, null, null, null); -- adriana.doe@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('REJECTED', 3, 2, null, null, null); -- jonas@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 2, 3, 1,    null, 9   ); -- adriana.doe@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('PENDING',  5, 6, null, null, null); -- antoske69@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 5, 7, null, 3,    21  ); -- antoske69@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 5, 5, 2,    null, 13  ); -- antoske69@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('ACCEPTED', 5, 4, null, null, 22  ); -- antoske69@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('PENDING', 1, 8, null, null, null  ); -- antoske69@gmail.com
INSERT INTO USER_TRIP(participation_status, user_id, trip_id, car_data_id, flight_data_id, room_id) VALUES ('PENDING', 2, 8, null, null, null  ); -- antoske69@gmail.com

-- AVAILABILITY                                 date, user_id
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-25', 5); -- antoske69@gmail.com
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-26', 5); -- antoske69@gmail.com
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-27', 5); -- antoske69@gmail.com
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-28', 5); -- antoske69@gmail.com
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-29', 5); -- antoske69@gmail.com
INSERT INTO AVAILABILITY(date, user_id) VALUES ('2019-05-30', 5); -- antoske69@gmail.com
