const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the index.html file
app.get('/test', (req, res) => {
    res.send('Hello, this is a test response!');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
 });

// Set port to start the app on
app.set('port', (process.env.PORT || 8080))

// Start the application
app.listen(app.get('port'), function () {
	console.log("Node app is running at localhost:" + app.get('port'))
})
