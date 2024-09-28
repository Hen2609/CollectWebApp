const express = require('express');
const router = express.Router();

const {handleStatsPage} = require("../../controllers/pages/stats");
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")

router.get("/", userAdminGuard, handleStatsPage)

module.exports = router;
