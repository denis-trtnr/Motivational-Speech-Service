//import ollama from 'ollama'
const os = require('os');
const express = require('express');
const { addAsync } = require('@awaitjs/express')
const path = require('path');
//const app = addAsync(express());
const mariadb = require('mariadb')
//const fetch = require('node-fetch');  // Falls noch nicht installiert: npm install node-fetch
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Middleware zum Verarbeiten von JSON-Daten

// Root-Route, die index.html aus dem public-Ordner lädt bzw (__dirname, "public"..) oben genauso
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//app.get('/test', (req, res) => {
//    res.send('Hello, this is a test response!');
//});


/*

//Store data to database
//async function storeToDatabase(input, mood, speech_proposal, audioFilePath) {

    if (!fs.existsSync(audioFilePath)) {
        console.error('Audiodatei existiert nicht:', audioFilePath);
        return;
    }

    let connection
    let query = `
        INSERT INTO motivational_speeches (input, mood, speech_proposal, audio_file)
        VALUES (?, ?, ?, LOAD_FILE(?))
     `;

     let values = [input, mood, speechProposal, audioFilePath];

    try {
        connection = await pool.getConnection()
        console.log("Executing query " + query)
        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Fehler beim Einfügen des Eintrags:', error);
                return;
            }
            console.log('Eintrag erfolgreich gespeichert:', results.insertId);
        });

    } finally {
        if (connection)
            connection.end()
    }
}

// Redirect to a default person/speech
app.get('/', function (request, response) {
     response.writeHead(302, { 'Location': 'speech/sample' })
     response.end()
 })*/

// // Get a motivational speech for a specific user
// app.getAsync('/speech/:id', async function (request, response) {
//     let userid = request.params["id"];
//     //let data = await getFromDatabase(userid);
//     let data = "testing sample";
//     if (data) {
//         send_response(response, data);
//     } else {
//         send_response(response, "No speech found");
//     }
// });



//------------------------------------------------------------------------------------------------



// // nicht getestet funktionierts?

// let history = []; // Array zum Speichern der letzten drei Prompts
 
// app.postAsync('/generate', async (req, res) => {
//     const { prompt, mood } = req.body;
    
//     // Fest definierte Parameter
//     const model = 'llama.3.1:8b';
//     const apiUrl = 'http://localhost:11434/api/generate'; 
//     const format = 'json';
//     const stream = false;

//     // Einfache Validierung der Eingabedaten
//     if (!prompt || !mood) {
//         return res.status(400).json({ error: "Prompt is required" });
//     }

//     // Beispielantwort (Logik zum Generieren von Texten/Antworten eingefügt werden)
//     const responseText = `Response from model based on prompt: "${prompt}" and "${mood}" mood`;

//     // Historie aktualisieren (nur die letzten 3 Einträge behalten)
//     history.unshift(prompt);
//     if (history.length > 3) {
//         history.pop();
//     }

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 model: model,
//                 prompt: prompt,
//                 mood: mood,
//                 stream: false,
//                 format: 'json',
//             }),
//         });

//         // Überprüfen, ob die Anfrage erfolgreich war
//         if (!response.ok) {
//             return res.status(response.status).json({ error: 'Fehler beim Abrufen der Antwort vom LLM-Server.' });
//         }

//         // Die JSON-Antwort verarbeiten
//         const data = await response.json();

//     //if schliefe nicht benötigt?
//     // Stream-Handling (wenn stream: true ist, könnte man die Antwort stückweise senden)
//     /* if (stream) {
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.write(JSON.stringify({ message: "Streaming started..." }));
//         setTimeout(() => {
//             res.write(JSON.stringify({ message: responseText }));
//             res.end();
//         }, 2000);  // Simuliert einen verzögerten Response-Stream
//     } else {*/


//         // Normale JSON-Antwort zurücksenden an client
//         res.json({
//             message: data.response, // responseText,
//             success: true,
//             stream: false,
//         });

//         } catch (error) {
//             console.error('Fehler:', error);
//             res.status(500).json({ error: 'Interner Serverfehler.' });
//         }

//         /* res.json({
//             model: model,
//             format: format,
//             stream: stream,
//             prompt: prompt,
//             message: responseText,
//             success: true,
//         });*/
//     //}
// });

// // Löschen ? Beispiel für eine GET-Route (z.B. für Motivationsrede für einen bestimmten User)
// app.getAsync('/speech/:id', async function (req, res) {
//     let userid = req.params["id"];
//     let data = "Sample motivational speech for user: " + userid;
//     if (data) {
//         res.json({ speech: data });
//     } else {
//         res.json({ speech: "No speech found" });
//     }
// });



//---------------------------------------------------------------------------------------------



// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})
