const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @typedef {Object} Location
 * @property {string} lat 
 * @property {string} lng 
 */




const LocationSchema = new Schema({
    lat: { type: String, required: true },
    lng: { type: String, required: true },
});

const LocationModel = mongoose.model('locations', LocationSchema);

module.exports = LocationModel
