// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 55567;

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
    res.status(200).json({success: true,message: 'Passenger deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting passenger:', error);
    // Send a generic error message to the browser
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the passenger.',
    });
  }
});

// Add a new station
app.post('/stations/add', async (req, res) => {
    try {
        const { stationName, locationDescription, muggleAccess } = req.body;
        const query = `
            INSERT INTO Stations (stationName, locationDescription, muggleAccess)
            VALUES (?, ?, ?)
        `;
        await db.query(query, [stationName, locationDescription, muggleAccess]);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error adding station:', err);
        res.status(500).json({ success: false });
    }
});

// delete a specific schedule
app.post('/schedules/delete', async function (req, res) {
    try {
        let { idRoute, idStation } = req.body;

        // Cleanse: convert to integers, or return error if invalid
        idRoute = parseInt(idRoute);
        idStation = parseInt(idStation);

        if (isNaN(idRoute) || isNaN(idStation)) {
            return res.status(400).send('Invalid route or station ID.');
        }

        // Execute delete procedure
        const query = `CALL delete_schedule(?, ?);`;
        await db.query(query, [idRoute, idStation]);

        console.log(`DELETE schedule | Route ID: ${idRoute}, Station ID: ${idStation}`);

        // Redirect to updated schedules page
        res.redirect('/schedules');
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).send('An error occurred while deleting the schedule.');
    }
});

// update a schedule
app.post('/schedules/edit', async function (req, res) {
    try {
        let {
            originalIdRoute,
            originalIdStation,
            idRoute,
            idStation,
            arrivalTime,
            departureTime
        } = req.body;

        // Parse all IDs to integers
        originalIdRoute = parseInt(originalIdRoute);
        originalIdStation = parseInt(originalIdStation);
        idRoute = parseInt(idRoute);
        idStation = parseInt(idStation);

        // Validate IDs
        if (
            isNaN(originalIdRoute) || isNaN(originalIdStation) ||
            isNaN(idRoute) || isNaN(idStation)
        ) {
            return res.status(400).send('Invalid route or station ID.');
        }

        // Optional: convert empty times to NULL
        if (!arrivalTime) arrivalTime = null;
        if (!departureTime) departureTime = null;

        // Call the new procedure
        const query = `CALL update_schedule_by_original(?, ?, ?, ?, ?, ?);`;
        await db.query(query, [
            originalIdRoute,
            originalIdStation,
            idRoute,
            idStation,
            arrivalTime,
            departureTime
        ]);

        console.log(`UPDATED schedule | Original Route: ${originalIdRoute}, Original Station: ${originalIdStation}, New Route: ${idRoute}, New Station: ${idStation}, Arrival: ${arrivalTime}, Departure: ${departureTime}`);

        // Redirect to updated schedules page
        res.redirect('/schedules');
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).send('An error occurred while updating the schedule.');
    }
});

// create a new schedule
app.post('/schedules/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Cleanse data: if idRoute or idStation are not numbers, set them to NULL
        if (isNaN(parseInt(data.create_schedule_idRoute)))
            data.create_schedule_idRoute = null;
        if (isNaN(parseInt(data.create_schedule_idStation)))
            data.create_schedule_idStation = null;

        // If arrivalTime or departureTime are empty, set them to NULL
        if (!data.create_schedule_arrivalTime)
            data.create_schedule_arrivalTime = null;
        if (!data.create_schedule_departureTime)
            data.create_schedule_departureTime = null;

        // Create and execute our query
        // Using parameterized queries to prevent SQL injection
        const query1 = `
            INSERT INTO Schedules (idRoute, idStation, arrivalTime, departureTime)
            VALUES (?, ?, ?, ?);
        `;

        // Execute the insert
        const [result] = await db.query(query1, [
            data.create_schedule_idRoute,
            data.create_schedule_idStation,
            data.create_schedule_arrivalTime,
            data.create_schedule_departureTime
        ]);

        console.log(`CREATE schedule. ID: ${result.insertId} | Route ID: ${data.create_schedule_idRoute}, Station ID: ${data.create_schedule_idStation}`);

        // Redirect to updated schedule page
        res.redirect('/schedules');
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send('An error occurred while executing the database queries.');
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
