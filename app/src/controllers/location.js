const LocationModel = require("../models/location")
const crypto = require('crypto')
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
    const locations = await LocationModel.find({}) 
    return locations
}

module.exports = {
    getLocations
}