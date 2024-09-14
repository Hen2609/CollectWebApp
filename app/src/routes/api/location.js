const express = require('express');

const router = express.Router();
const {
    handleGetAllLocations
} = require('../../controllers/api/location');

router.get("/", handleGetAllLocations)

module.exports = router;