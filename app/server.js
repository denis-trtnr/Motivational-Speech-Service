//const os = require('os');
const express = require('express');
const path = require('path');
const app = express();
//const { addAsync } = require('@awaitjs/express')
const PORT = process.env.PORT || 3000;
//const mariadb = require('mariadb')
//const fetch = require('node-fetch');  // Falls noch nicht installiert: npm install node-fetch

// Serve the index.html file
app.get('/test', (req, res) => {
    res.send('Hello, this is a test response!');
});

app.use(express.static(path.join(__dirname)));
//app.use(express.json()); // Middleware zum Verarbeiten von JSON-Daten


// Root-Route, die index.html aus dem public-Ordner lädt bzw (__dirname, "public"..) oben genauso
app.get('/xyz', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
});


// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})