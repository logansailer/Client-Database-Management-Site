SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- drop tables before creating
DROP TABLE IF EXISTS Passengers;
DROP TABLE IF EXISTS Schedules;
DROP TABLE IF EXISTS Trains;
DROP TABLE IF EXISTS Stations;
DROP TABLE IF EXISTS Routes;

-- routes table
CREATE TABLE Routes (
    idRoute INT NOT NULL AUTO_INCREMENT,
    routeName VARCHAR(50) NOT NULL UNIQUE,
    duration TIME NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    PRIMARY KEY (idRoute)
);

-- stations table
CREATE TABLE Stations (
    idStation INT NOT NULL AUTO_INCREMENT,
    stationName VARCHAR(50) NOT NULL UNIQUE,
    locationDescription VARCHAR(500) NOT NULL,
    muggleAccess BOOLEAN NOT NULL,
    PRIMARY KEY (idStation)
);

-- schedules table, intersects route and station with added variables
CREATE TABLE Schedules (
    idRoute INT NOT NULL,
    idStation INT NOT NULL,
    arrivalTime DATETIME NOT NULL,
    departureTime DATETIME NOT NULL,
    PRIMARY KEY (idRoute, idStation),
    FOREIGN KEY (idRoute) REFERENCES Routes(idRoute) ON DELETE CASCADE,
    FOREIGN KEY (idStation) REFERENCES Stations(idStation) ON DELETE CASCADE
);

-- trains table
CREATE TABLE Trains (
    idTrain INT NOT NULL AUTO_INCREMENT,
    trainName VARCHAR(50) NOT NULL UNIQUE,
    maxCapacity INT NOT NULL,
    idRoute INT NOT NULL,
    PRIMARY KEY (idTrain),
    FOREIGN KEY (idRoute) REFERENCES Routes(idRoute) ON DELETE CASCADE
);

-- passengers table
CREATE TABLE Passengers (
    idPassenger INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    house VARCHAR(50),
    bloodStatus ENUM('W','M'),
    idTrain INT NOT NULL,
    FOREIGN KEY (idTrain) REFERENCES Trains(idTrain) ON DELETE CASCADE
);

-- insert 4 test data Routes
INSERT INTO Routes (routeName, duration, frequency) VALUES
('The Hearthlight Circuit', '00:30:00', '12 daily'),
('The Emberlash Loop', '04:00:00', '5 daily'),
('The Antler Passage', '05:00:00', '3 daily'),
('The Schoolbound Path', '08:00:00', '4 yearly');

-- insert 4 test data Stations
INSERT INTO Stations (stationName, locationDescription, muggleAccess) VALUES
('Platform 9 3/4', 'located in the muggle world to access the wizarding world', TRUE),
('Antler Hollow', 'located in north wizarding village to take passengers to Hogwarts', FALSE),
('Emberlash Cross', 'located in a remote magical settlement', FALSE),
('Hearthlight Station', 'located in the heart of the city for magical commuters', FALSE);

-- insert 4 test data to Schedules, with M:M relationship between routes and stations
INSERT INTO Schedules (idRoute, idStation, arrivalTime, departureTime) VALUES
(1, 4, '2025-09-01 11:00:00', '2025-09-01 11:02:00'),  -- The Hearthlight Circuit stops at Hearthlight Station
(2, 3, '2025-07-24 8:30:00', '2025-07-24 8:35:00'),  -- The Emberlash Loop stops at Emberlash Cross
(3, 2, '2025-07-25 13:00:00', '2025-07-25 13:02:00'),  -- The Antler Passage stops at Antler Hollow
(4, 1, '2025-07-24 17:00:00', '2025-07-24 17:10:00'),  -- The Schoolbound Path starts at Platform 9 3/4
(4, 2, '2025-07-24 17:30:00', '2025-07-24 17:35:00');  -- and ends at Antler Hollow (schoolbound)

-- insert 4 Trains associated with a Route
INSERT INTO Trains (trainName, maxCapacity, idRoute) VALUES
('The Hogwarts Express', 500, 4),
('The Silver Antler', 300, 3),
('Emberlash Express', 200, 2),
('Hearthlight Carriage', 100, 1);

-- create 4 test data Passengers
INSERT INTO Passengers (firstName, lastName, house, bloodStatus, idTrain) VALUES
('Harry', 'Potter', 'Gryffindor', 'W', 2),
('Hermione', 'Granger', 'Gryffindor', 'W', 4),
('Draco', 'Malfoy', 'Slytherin', 'W', 3),
('Dudley', 'Dursley', NULL, 'M', 1);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;