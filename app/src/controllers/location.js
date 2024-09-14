const {
    getLocations
} = require('../services/location');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const handleGetAllLocations = async (req, res) => {
    const locations = await getLocations()
    res.status(200).json(locations)
};

module.exports = {
    handleGetAllLocations
}