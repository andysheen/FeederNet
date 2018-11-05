var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feederSchema = new Schema({
    stub: String,
    name: String,
    location: {
        latitude: String,
        longitude: String
    },
    lastPing: String
});

module.exports = mongoose.model('feeder', feederSchema);
