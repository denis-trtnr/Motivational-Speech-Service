const os = require('os');
const fetch = require('node-fetch');
const express = require('express');
const { addAsync } = require('@awaitjs/express')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mariadb = require('mariadb')

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Enviroment variables to connect to the cluster container
const ttsApiUrl = process.env.TTS_API_URL || "http://localhost:5000";
const llmApiUrl = process.env.LLM_URL || "http://localhost:11434";

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


// API to retrieve data from mariadb database
app.get('/api/speeches', async (req, res) => {

    let connection
    let query = 'SELECT input, mood, speech_proposal, audio_file FROM motivational_speeches ORDER BY ID DESC LIMIT 3 ;'

    try {
        connection = await pool.getConnection()
        const results = await connection.query(query)

        return res.json(results)

    } catch (error) {
        console.error('Error during query:', error)
        res.status(500).send('Error when retrieving the data');

    } finally {
        if (connection) connection.end()
    }

});

// API to connect to text-to-speech model to generate audio-file
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
            body: JSON.stringify({ text, speaker })
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
        console.log("Sending the response");
        res.send(audioBuffer); // Send the buffer containing the WAV file to the client
    } catch (error) {
        console.error('Error calling TTS service:', error);
        res.status(500).send({ error: 'TTS service error' });
    }
});


// API to save data to mariadb database
app.post('/api/speeches', async (req, res) => {
    const { input, mood, speech_proposal } = req.body;
    
    if (!input || !mood || !speech_proposal) {
        return res.status(400).send('Missing fields');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const query = 'INSERT INTO motivational_speeches (input, mood, speech_proposal, audio_file) VALUES (?, ?, ?, LOAD_FILE(?))';
        await connection.query(query, [input, mood, speech_proposal, audio_file]);
        res.status(201).send('Data successfully saved');
    } catch (error) {
        console.error('Error when saving the data: ', error);
        res.status(500).send('Error when saving the data.');
    } finally {
        if (connection) connection.end();
    }
});

// API to connect to ollama and generate the motivational speech
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send('Fehlende Felder');
    }

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
        const response = await fetch(`${llmApiUrl}/api/generate`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            return res.status(response.status).send(`Error: ${response.statusText}`);
        }

        const result = await response.json()
        return res.json(result);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
});


// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})
