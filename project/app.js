// Citation for use of AI Tools:
// Date: 8/8/2025
// Adapted from code generated with the prompt:
// Can you help to write a app.post '/delete-passenger' route that
// passes a passenger id to my delete_passenger procedure [PL.SQL]
// AI Source URL: https://copilot.microsoft.com/

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

// get home page
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

//get passengers
app.get('/passengers', async function (req, res) {
    try {
        const queryPassengers = `SELECT * FROM passenger_view;`;
        const queryTrains = 'SELECT * FROM train_view;'
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

//get routes
app.get('/routes', async function (req, res) {
    try {
        const queryRoutes = 'SELECT * FROM route_view;'
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

// get schedules
app.get('/schedules', async function (req, res) {
    try {
        const querySchedules = `SELECT * FROM schedule_view;`
        const queryRoutes = 'SELECT * FROM route_view;'
        const queryStations = 'SELECT * FROM station_view;'
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

// get stations
app.get('/stations', async function (req, res) {
    try {
        const queryStations = 'SELECT * FROM station_view;'
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

// get trains
app.get('/trains', async function (req, res) {
    try {
        const queryTrains = `SELECT * FROM train_view;`
        const queryRoutes = 'SELECT * FROM route_view'
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

// reset data
app.post('/reset', async function (req, res) {
    try {
        // calls the procedure to reset the database
        const resetQuery = `CALL reset_data();`;
        await db.query(resetQuery);
        res.status(200).json({ success: true, message: 'Database reset successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// delete a specific passenger
app.post('/delete-passenger', async function (req, res) {
  const { idPassenger } = req.body;

  try {
    await db.query(`CALL delete_passenger(?)`, [idPassenger]);

    res.status(200).json({
      success: true,
      message: 'Passenger deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting passenger:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the passenger.',
    });
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