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

app.get('/bsg-people', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT bsg_people.id, bsg_people.fname, bsg_people.lname, \
            bsg_planets.name AS 'homeworld', bsg_people.age FROM bsg_people \
            LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;
        const query2 = 'SELECT * FROM bsg_planets;';
        const [people] = await db.query(query1);
        const [homeworlds] = await db.query(query2);


        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('bsg-people', { people: people, homeworlds: homeworlds });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/passengers', async function (req, res) {
    try {
        const queryPassengers = 'SELECT * FROM Passengers'
        const [passengers] = await db.query(queryPassengers);

        // Render the passengers.hbs file, and also send the renderer
        //  an object that contains the passengers entity from the database
        res.render('passengers', { passengers: passengers });
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
        const querySchedules = 'SELECT * FROM Schedules'
        const [schedules] = await db.query(querySchedules);

        // Render the schedules.hbs file, and also send the renderer
        //  an object that contains the schedules entity from the database
        res.render('schedules', { schedules: schedules });
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
        const queryTrains = 'SELECT * FROM Trains'
        const [trains] = await db.query(queryTrains);

        // Render the trains.hbs file, and also send the renderer
        //  an object that contains the trains entity from the database
        res.render('trains', { trains: trains });
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