const os = require('os');
const express = require('express');
const { addAsync } = require('@awaitjs/express')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mariadb = require('mariadb')

//Database configuration
const pool = mariadb.createPool({
    host: 'my-app-mariadb-service',
    database: 'motivationalspeechsdb',
    user: 'root',
    password: 'mysecretpw',
    connectionLimit: 5
})


app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Middleware zum Verarbeiten von JSON-Daten


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
 });

// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})

//Get data from database
async function getFromDatabase() {
    let connection
    let query = 'SELECT input, mood, speech_proposal FROM motivational_speeches LIMIT 10;'
    let results

    try {
        connection = await pool.getConnection()
        console.log("Executing query " + query)
        results = await connection.query(query) // Abfrage ausführen und Daten holen
        console.log('Daten abgerufen:', results)
    } catch (error) {
        console.error('Fehler bei der Abfrage:', error)
        throw error;
    } finally {
        if (connection) connection.end() // Verbindung schließen
    }
    return results; // Ergebnisse zurückgeben

}

// API-Endpunkt, um die Daten abzurufen
app.get('/api/speeches', async (req, res) => {
    try {
        const data = await getFromDatabase(); // Daten aus der Datenbank holen
        res.json(data); // Daten als JSON an den Client senden
    } catch (error) {
        res.status(500).send('Fehler beim Abrufen der Daten');
    }
});

