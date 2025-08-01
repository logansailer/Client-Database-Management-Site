// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 55566;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/passengers', async function (req, res) {
    try {
        const queryPassengers = `SELECT Passengers.idPassenger, Passengers.firstName, \
            Passengers.lastName, Passengers.house, Passengers.bloodStatus, \
            Trains.name AS 'ridingTrain' FROM Passengers \
            LEFT JOIN Trains ON Passengers.idTrain = Trains.idTrain;`;
        const queryTrains = 'SELECT * FROM Trains'
        const [passengers] = await db.query(queryPassengers);
        const [trains] = await db.query(queryTrains);

        // Render the passengers.hbs file, and also send the renderer
        //  an object that contains the passengers entity from the database
        res.render('passengers', { passengers: passengers, trains: trains });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/routes', async function (req, res) {
    try {
        const queryRoutes = 'SELECT * FROM Routes'
        const [routes] = await db.query(queryRoutes);
        // Render the routes.hbs file, and also send the renderer
        //  an object that contains the routes entity from the database
        res.render('routes', { routes: routes });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/schedules', async function (req, res) {
    try {
        const querySchedules = `SELECT Routes.name AS 'onRoute', Stations.name as 'atStation', \
            Schedules.arrivalTime, Schedules.departureTime FROM Schedules \
            LEFT JOIN Routes ON Schedules.idRoute = Routes.idRoute
            LEFT JOIN Stations ON Schedules.idStation = Stations.idStation;`
        const queryRoutes = 'SELECT * FROM Routes'
        const queryStations = 'SELECT * FROM Stations'
        const [schedules] = await db.query(querySchedules);
        const [routes] = await db.query(queryRoutes);
        const [stations] = await db.query(queryStations);

        // Render the schedules.hbs file, and also send the renderer
        //  an object that contains the schedules entity from the database
        res.render('schedules', { schedules: schedules,  routes: routes, stations: stations});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/stations', async function (req, res) {
    try {
        const queryStations = 'SELECT * FROM Stations'
        const [stations] = await db.query(queryStations);

        // Render the stations.hbs file, and also send the renderer
        // an object that contains the stations entity from the database
        res.render('stations', { stations: stations });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/trains', async function (req, res) {
    try {
        const queryTrains = `SELECT Trains.idTrain, Trains.name, \
            Trains.maxCapacity, Routes.name AS 'onRoute' FROM Trains \
            LEFT JOIN Routes ON Trains.idRoute = Routes.idRoute;`
        const queryRoutes = 'SELECT * FROM Routes'
        const [trains] = await db.query(queryTrains);
        const [routes] = await db.query(queryRoutes);

        // Render the trains.hbs file, and also send the renderer
        //  an object that contains the trains entity from the database
        res.render('trains', { trains: trains, routes: routes });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});