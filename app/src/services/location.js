const LocationModel = require("../models/location")
/**
 * @fileoverview This file defines the getCategories function.
 * @requires ../models/location
 * @typedef {import('../models/location').Location} Location
 */

/**
 * @async
 * @function getLocations
 * @returns {Promise<Location[]>}
 */
async function getLocations(){
    return LocationModel.find({});
}

module.exports = {
    getLocations
}