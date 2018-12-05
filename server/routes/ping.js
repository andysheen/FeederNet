var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Feeder = require('../models/feeder');

// API routes
router.post('/ping', getFeederId, addEvent, updateLastPing);

// Get Feeder ID from stub
function getFeederId(req, res, next) {
  Feeder.findOne({stub: req.body.stub})
  .exec((err, feeder) => {
    if (err) {
      res.json({'ERROR': err});
    } else if (!feeder) {
      console.log("ERROR: Feeder stub not found.");
      res.send(400);
    } else {
      console.log("INFO: Found feeder in DB.");
      res.locals.feeder_id = feeder._id;
      res.locals.timestamp = String(Math.floor(new Date() / 1000));
      next();
    }
  });
}

// Add new event
function addEvent(req, res, next) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var newEvent = new Event({
    type: 'ping-' + req.body.stub,
    ip: ipAddress,
    datetime: res.locals.timestamp
  });
  newEvent.save((err) => {
    if (err) {
      res.json({'ERROR': err});
    } else {
      console.log("INFO: Added ping event.");
      next();
    }
  });
}

// Update lastPing
function updateLastPing(req, res) {
  Feeder.findById(res.locals.feeder_id, (err, feeder) => {
    feeder.lastPing = res.locals.timestamp;
    if (req.body.lastPing) feeder.lastPing = req.body.lastPing;
    feeder.save((err) => {
      if (err) {
        res.json({'ERROR': err});
      } else {
        console.log("INFO: Updated feeder lastPing.");
        res.json({'UPDATED': feeder});
      }
    });
  });

}

module.exports = router;