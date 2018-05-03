const express = require('express');
const mysql = require('mysql');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

var mysqlConnection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});

var connectedFeeders = new Array();

// Connect to MySQL database
mysqlConnection.connect(function(err) {
    if (err) {
        console.log("ERROR: Database connection failed: " + err.stack);
        return;
    }
    console.log("INFO: Connected to database.");
});

mysqlConnection.end();

app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function() {
    console.log('Node version: ' + process.versions.node);
    console.log('Server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
    console.log("INFO: New socket connection opened.");

    // Emit an ID request to the current socket to see if it's a feeder.
    socket.emit('idRequest', " ");

    socket.on('newTrack', function(data) {
        console.log("INFO: Received new track event!");
    });

    socket.on('idTransmit', function(data) {
        console.log("INFO: Received new feeder ID " + data.feederName);
        connectedFeeders.push({feederName: data.feederName, socketID: socket.id});
        console.log("INFO: Associated " + data.feederName + " with ID " + socket.id);
    });

    socket.on('disconnect', function() {
        console.log("INFO: Socket disconnected. Socket ID: " + socket.id);
        for (var key in connectedFeeders) {
            if (connectedFeeders[key].socketID == socket.id) {
                console.log("INFO: Feeder " + connectedFeeders[key].feederName + " disconnected.");
                delete connectedFeeders[key];
            }
        }
    });
});
