const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');

// Mongoose
mongoose.connect('mongodb://localhost/node-testing', {useNewUrlParser: true}, (err, res) => {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database!');
  }
});

// Routes
const birds = require('./routes/birds.js');
const feeders = require('./routes/feeders.js');
const events = require('./routes/events.js');
const waypoints = require('./routes/waypoints.js');

// Express instance
var app = express();

// Config middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Main routes
app.use('/api/', birds);
app.use('/api/', feeders);
app.use('/api/', events);
app.use('/api/', waypoints);

// Server configuration
var server = http.createServer(app);
server.listen(3000, () => {
    console.log('INFO: Server started.');
});

module.exports = app;