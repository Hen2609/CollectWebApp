const express = require('express');

const router = express.Router();
const {
    getLocations
} = require('../../controllers/location');

router.get("/", async (req, res) => {
    const locations = await getLocations()
    res.status(200).json(locations)
})

module.exports = router;