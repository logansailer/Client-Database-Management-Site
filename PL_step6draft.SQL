-- Citation for use of AI Tools:
-- Date: 8/15/2025
-- Adapted from code generated with the prompt:
-- Can you help me edit the UPDATE schedule procedure to work with the app.post('/schedules/edit') route I implemented [SQL]
-- AI Source URL: https://copilot.microsoft.com/

-------------------------------------
-- PL/SQL operations for whole DB --
-------------------------------------

-------------------------------------
-- CUD OPERATIONS FOR STATION --
-------------------------------------
--------|CREATE|---------------
DELIMITER //

CREATE PROCEDURE create_station(
    IN p_stationName VARCHAR(100),
    IN p_locationDescription TEXT,
    IN p_muggleAccess BOOLEAN
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not create station.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Stations (stationName, locationDescription, muggleAccess)
    VALUES (p_stationName, p_locationDescription, p_muggleAccess);

    COMMIT;

    SELECT 'Station created successfully.' AS Result;
END //

DELIMITER ;

--------|UPDATE|---------------
DELIMITER //

CREATE PROCEDURE update_station(
    IN p_idStation INT,
    IN p_stationName VARCHAR(100),
    IN p_locationDescription TEXT,
    IN p_muggleAccess BOOLEAN
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not update station.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Stations
    SET stationName = p_stationName,
        locationDescription = p_locationDescription,
        muggleAccess = p_muggleAccess
    WHERE idStation = p_idStation;

    COMMIT;

    SELECT 'Station updated successfully.' AS Result;
END //

DELIMITER ;

--------|DELETE|---------------
DELIMITER //

CREATE PROCEDURE delete_station(IN p_idStation INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not delete station.' AS Result;
    END;

    START TRANSACTION;

    DELETE FROM Stations WHERE idStation = p_idStation;

    COMMIT;

    SELECT 'Station deleted successfully (Schedules auto-cleaned).' AS Result;
END //

DELIMITER ;


-------------------------------------
-- CUD OPERATIONS FOR ROUTE --
-------------------------------------
--------|CREATE|---------------
DELIMITER //

CREATE PROCEDURE create_route(
    IN p_routeName VARCHAR(100),
    IN p_duration TIME,
    IN p_frequency VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not create route.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Routes (routeName, duration, frequency)
    VALUES (p_routeName, p_duration, p_frequency);

    COMMIT;

    SELECT 'Route created successfully.' AS Result;
END //

DELIMITER ;

--------|UPDATE|---------------
DELIMITER //

CREATE PROCEDURE update_route(
    IN p_idRoute INT,
    IN p_routeName VARCHAR(100),
    IN p_duration TIME,
    IN p_frequency VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not update route.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Routes
    SET routeName = p_routeName,
        duration = p_duration,
        frequency = p_frequency
    WHERE idRoute = p_idRoute;

    COMMIT;

    SELECT 'Route updated successfully.' AS Result;
END //

DELIMITER ;

--------|DELETE|---------------
DELIMITER //

CREATE PROCEDURE delete_route(IN p_idRoute INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not delete route.' AS Result;
    END;

    START TRANSACTION;

    DELETE FROM Routes WHERE idRoute = p_idRoute;

    COMMIT;

    SELECT 'Route deleted successfully (Schedules auto-cleaned).' AS Result;
END //

DELIMITER ;


-------------------------------------
-- CUD OPERATIONS FOR SCHEDULE --
-------------------------------------

---------|CREATE|---------------
DELIMITER //

CREATE PROCEDURE create_schedule(
    IN p_idRoute INT,
    IN p_idStation INT,
    IN p_arrivalTime DATETIME,
    IN p_departureTime DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not create schedule.' AS Result;
    END;

    START TRANSACTION;

    INSERT INTO Schedules (idRoute, idStation, arrivalTime, departureTime)
    VALUES (p_idRoute, p_idStation, p_arrivalTime, p_departureTime);

    COMMIT;

    SELECT 'Schedule entry created successfully.' AS Result;
END //

DELIMITER ;
--------|UPDATE|---------------
DELIMITER //

CREATE PROCEDURE update_schedule(
    IN p_idRoute INT,
    IN p_idStation INT,
    IN p_arrivalTime DATETIME,
    IN p_departureTime DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not update schedule.' AS Result;
    END;

    START TRANSACTION;

    UPDATE Schedules
    SET arrivalTime = p_arrivalTime,
        departureTime = p_departureTime
    WHERE idRoute = p_idRoute
      AND idStation = p_idStation;

    COMMIT;

    SELECT 'Schedule entry updated successfully.' AS Result;
END //

DELIMITER ;

--------|DELETE|---------------
DELIMITER //

CREATE PROCEDURE delete_schedule(
    IN p_idRoute INT,
    IN p_idStation INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! Could not delete schedule.' AS Result;
    END;

    START TRANSACTION;

    DELETE FROM Schedules
    WHERE idRoute = p_idRoute
      AND idStation = p_idStation;

    COMMIT;

    SELECT 'Schedule entry deleted successfully.' AS Result;
END //

DELIMITER ;

-------------------------------------
-- DATABASE RESET --
-------------------------------------
DELIMITER //

CREATE PROCEDURE reset_data()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back if any error occurs
        ROLLBACK;
        SELECT 'Error! Could not reset Data' AS Result;
    END;

    -- Start transaction
    START TRANSACTION;

    -- Step 1: Delete from each table
    DELETE FROM Passengers;
    DELETE FROM Trains;
    DELETE FROM Schedules;
    DELETE FROM Stations;
    DELETE FROM Routes;

    -- Step 2: Reinsert data into Routes
    INSERT INTO Routes (routeName, duration, frequency) VALUES
    ('The Hearthlight Circuit', '00:30:00', '12 daily'),
    ('The Emberlash Loop', '04:00:00', '5 daily'),
    ('The Antler Passage', '05:00:00', '3 daily'),
    ('The Schoolbound Path', '08:00:00', '4 yearly');

    -- Step 3: Reinsert data into Stations
    INSERT INTO Stations (stationName, locationDescription, muggleAccess) VALUES
    ('Platform 9 3/4', 'located in the muggle world to access the wizarding world', TRUE),
    ('Antler Hollow', 'located in north wizarding village to take passengers to Hogwarts', FALSE),
    ('Emberlash Cross', 'located in a remote magical settlement', FALSE),
    ('Hearthlight Station', 'located in the heart of the city for magical commuters', FALSE);

    -- Step 4: Reinsert data into Schedules
    INSERT INTO Schedules (idRoute, idStation, arrivalTime, departureTime) VALUES
    (1, 4, '2025-09-01 11:00:00', '2025-09-01 11:02:00'),
    (2, 3, '2025-07-24 08:30:00', '2025-07-24 08:35:00'),
    (3, 2, '2025-07-25 13:00:00', '2025-07-25 13:02:00'),
    (4, 1, '2025-07-24 17:00:00', '2025-07-24 17:10:00'),
    (4, 2, '2025-07-24 17:30:00', '2025-07-24 17:35:00');

    -- Step 5: Reinsert data into Trains
    INSERT INTO Trains (trainName, maxCapacity, idRoute) VALUES
    ('The Hogwarts Express', 500, 4),
    ('The Silver Antler', 300, 3),
    ('Emberlash Express', 200, 2),
    ('Hearthlight Carriage', 100, 1);

    -- Step 6: Reinsert data into Passengers
    INSERT INTO Passengers (firstName, lastName, house, bloodStatus, idTrain) VALUES
    ('Harry', 'Potter', 'Gryffindor', 'W', 2),
    ('Hermione', 'Granger', 'Gryffindor', 'W', 4),
    ('Draco', 'Malfoy', 'Slytherin', 'W', 3),
    ('Dudley', 'Dursley', NULL, 'M', 1);

    -- Step 7: Commit changes
    COMMIT;

    -- Return success message
    SELECT 'Train system data successfully reset and reloaded.' AS Result;
END //
DELIMITER ;

-------------------------------------
-- VIEW PASSENGERS --
-------------------------------------
CREATE OR REPLACE VIEW passenger_view AS
SELECT 
    Passengers.idPassenger,
    Passengers.firstName,
    Passengers.lastName,
    Passengers.house,
    Passengers.bloodStatus,
    Trains.trainName AS ridingTrain
FROM Passengers
LEFT JOIN Trains 
    ON Passengers.idTrain = Trains.idTrain;

-------------------------------------
-- VIEW ROUTES --
-------------------------------------
CREATE OR REPLACE VIEW route_view AS
SELECT *
FROM Routes;

-------------------------------------
-- VIEW TRAINS --
-------------------------------------
CREATE OR REPLACE VIEW train_view AS
SELECT 
    Trains.idTrain, 
    Trains.trainName, 
    Trains.maxCapacity, 
    Routes.routeName AS onRoute
FROM Trains
LEFT JOIN Routes 
    ON Trains.idRoute = Routes.idRoute;

-------------------------------------
-- VIEW SCHEDULES --
-------------------------------------
CREATE OR REPLACE VIEW schedule_view AS
SELECT 
    Schedules.idRoute,
    Schedules.idStation,
    Routes.routeName AS onRoute, 
    Stations.stationName AS atStation, 
    Schedules.arrivalTime, 
    Schedules.departureTime
FROM Schedules
LEFT JOIN Routes 
    ON Schedules.idRoute = Routes.idRoute
LEFT JOIN Stations 
    ON Schedules.idStation = Stations.idStation;