-------------------------------------
-- CRUD operations for Routes --
-------------------------------------

-- CREATE
INSERT INTO Routes (routeName, duration, frequency)
VALUES (@routeNameInput, @durationInput, @frequencyInput);

-- READ
SELECT * FROM Routes
WHERE idRoute = @idRouteInput;

-- UPDATE
UPDATE Routes
SET routeName = @routeNameInput,
    duration = @durationInput,
    frequency = @frequencyInput,
WHERE idRoute = @idRouteInput;

-- DELETE
DELETE FROM Routes
WHERE idRoute = @idRouteInput;

-------------------------------------
-- CRUD operations for Stations --
-------------------------------------

-- CREATE
INSERT INTO Stations (stationName, locationDescription, muggleAccess)
VALUES (@stationNameInput, @locationDescriptionInput, @muggleAccessInput);

-- READ
SELECT * FROM Stations
WHERE idStation = @idStationInput;

-- UPDATE
UPDATE Stations
SET stationName = @stationNameInput,
    locationDescription = @locationDescriptionInput,
    muggleAccess = @muggleAccessInput
WHERE idStation = @idStationInput;

-- DELETE
DELETE FROM Stations
WHERE idStation = @idStationInput;

-------------------------------------
-- CRUD operations for Schedules --
-------------------------------------

-- CREATE
INSERT INTO Schedules (idRoute, idStation, arrivalTime, departureTime)
VALUES (@idRouteInput, @idStationInput, @arrivalTimeInput, @departureTimeInput);

-- READ
SELECT * FROM Schedules
WHERE idRoute = @idRouteInput AND idStation = @idStationInput;

-- UPDATE
UPDATE Schedules
SET arrivalTime = @arrivalTimeInput,
    departureTime = @departureTimeInput
WHERE idRoute = @idRouteInput AND idStation = @idStationInput;

-- DELETE
DELETE FROM Schedules
WHERE idRoute = @idRouteInput AND idStation = @idStationInput;

-------------------------------------
-- CRUD operations for Trains --
-------------------------------------
-- CREATE
INSERT INTO Trains (trainName, maxCapacity, idRoute)
VALUES (@trainNameInput, @maxCapacityInput, @idRouteInput);

-- READ
SELECT * FROM Trains
WHERE idTrain = @idTrainInput;

-- UPDATE
UPDATE Trains
SET trainName = @trainNameInput,
    maxCapacity = @maxCapacityInput,
    idRoute = @idRouteInput
WHERE idTrain = @idTrainInput;

-- DELETE
DELETE FROM Trains
WHERE idTrain = @idTrainInput;

-------------------------------------
-- CRUD operations for Passengers --
-------------------------------------

-- CREATE
INSERT INTO Passengers (firstName, lastName, house, bloodStatus, idTrain)
VALUES (@firstNameInput, @lastNameInput, @houseInput, @bloodStatusInput, @idTrainInput);

-- READ
SELECT * FROM Passengers
WHERE idPassenger = @idPassengerInput;

-- UPDATE
UPDATE Passengers
SET firstName = @firstNameInput,
    lastName = @lastNameInput,
    house = @houseInput,
    bloodStatus = @bloodStatusInput,
    idTrain = @idTrainInput
WHERE idPassenger = @idPassengerInput;

-- DELETE
DELETE FROM Passengers
WHERE idPassenger = @idPassengerInput;