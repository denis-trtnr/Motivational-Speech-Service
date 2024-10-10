const os = require('os');
const express = require('express')
const { addAsync } = require('@awaitjs/express')
const path = require('path');
const app = addAsync(express())
const mariadb = require('mariadb')

app.use(express.static(path.join(__dirname)));

// Root-Route, die index.html aus dem public-Ordner lädt bzw (__dirname, "public"..) oben genauso
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
/*
//Get data from database
//async function getFromDatabase(userid) {
    let connection
    let query = 'SELECT birth_date from persons WHERE person_key = ? LIMIT 1'

    try {
        connection = await pool.getConnection()
        console.log("Executing query " + query)
        let res = await connection.query(query, [userid])
        let row = res[0]

        if (row) {
            console.log("Query result = ", row)
            return row["birth_date"];
        } else {
            return null;
        }

    } finally {
        if (connection)
            connection.end()
    }
}

//Store data to database
//async function storeToDatabase(input, mood, speech_proposal, audioFilePath) {

    if (!fs.existsSync(audioFilePath)) {
        console.error('Audiodatei existiert nicht:', audioFilePath);
        return;
    }

    let connection
    let query = `
        INSERT INTO audio_entries (input, mood, speech_proposal, audio_file)
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

// Get a motivational speech for a specific user
app.getAsync('/speech/:id', async function (request, response) {
    let userid = request.params["id"];
    //let data = await getFromDatabase(userid);
    let data = "testing sample";
    if (data) {
        send_response(response, data);
    } else {
        send_response(response, "No speech found");
    }
});

// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})
