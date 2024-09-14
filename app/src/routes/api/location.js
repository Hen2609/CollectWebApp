const express = require('express');

const router = express.Router();
const {
    handleGetAllLocations
} = require('../../controllers/location');

router.get("/", handleGetAllLocations)

module.exports = router;