const os = require('os');
const express = require('express');
const { addAsync } = require('@awaitjs/express')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;



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


