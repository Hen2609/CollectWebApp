const express = require('express');
const router = express.Router();
const {handleOrdersPage} = require('../../controllers/pages/orders');
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")

router.get("/", userAuthenticatedGuard, handleOrdersPage)

module.exports = router;
