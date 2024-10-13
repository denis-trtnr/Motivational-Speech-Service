const os = require('os');
const fetch = require('node-fetch');
const express = require('express');
const { addAsync } = require('@awaitjs/express')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mariadb = require('mariadb')

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Middleware zum Verarbeiten von JSON-Daten

const ttsApiUrl = process.env.TTS_API_URL || "http://localhost:5000";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Database configuration
const pool = mariadb.createPool({
    host: 'my-app-mariadb-service',
    database: 'motivationalspeechsdb',
    user: 'root',
    password: 'mysecretpw',
    connectionLimit: 5
})

//Get data from database
async function getFromDatabase() {
    let connection
    let query = 'SELECT input, mood, speech_proposal FROM motivational_speeches LIMIT 15;'
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

app.post('/api/tts', async (req, res) => {
    try {
        const { text, speaker } = req.body;
        console.log(`Calling TTS service with text: ${text}, speaker: ${speaker}`);

        // Making a POST request to the TTS service
        const ttsResponse = await fetch(`${ttsApiUrl}/tts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!ttsResponse.ok) {
            const errorMessage = await ttsResponse.text();
            console.error('TTS Service Error:', errorMessage);
            return res.status(ttsResponse.status).send(`Error: ${errorMessage}`);
        }

        // Read the audio data as a buffer
        const audioBuffer = await ttsResponse.buffer();

        // Set the response headers for the WAV file
        res.set('Content-Type', 'audio/wav');
        res.send(audioBuffer); // Send the buffer containing the WAV file to the client
    } catch (error) {
        console.error('Error calling TTS service:', error);
        res.status(500).send({ error: 'TTS service error' });
    }
});


// API-Endpunkt zum Speichern von Benutzereingaben in der Datenbank
app.post('/api/speeches', async (req, res) => {
    const { input, mood, speech_proposal } = req.body;  // Die Daten, die vom Client gesendet werden
    
    if (!input || !mood || !speech_proposal) {
        return res.status(400).send('Fehlende Felder');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const query = 'INSERT INTO motivational_speeches (input, mood, speech_proposal) VALUES (?, ?, ?)';
        await connection.query(query, [input, mood, speech_proposal]); // Daten in die DB einfügen
        res.status(201).send('Daten erfolgreich gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
        res.status(500).send('Fehler beim Speichern der Daten');
    } finally {
        if (connection) connection.end();
    }
});

// API-Endpunkt zum Generieren der Motivationsrede
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;  // Die Daten, die vom Client gesendet werden

    console.log("Getting promt: "+ prompt)

    if (!prompt) {
        return res.status(400).send('Fehlende Felder');
    }

    const url = 'http://10.104.171.206:11434/api/generate';
    const headers = {
        'Content-Type': 'application/json'
    };

    const data = {
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
        format: 'json',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            return res.status(response.status).send(`Error: ${response.statusText}`);
        }

        const result = await response.json()
        return result.response;

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});



//----------------------------------------------------------------------------

// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})
