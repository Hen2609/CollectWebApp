const express = require('express');
const router = express.Router();

const {handleStatsPage} = require("../../controllers/pages/stats");

router.get("/", handleStatsPage)

module.exports = router;
