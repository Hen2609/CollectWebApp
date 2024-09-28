const express = require('express');
const router = express.Router();

const {handleProductPage} = require("../../controllers/pages/product");
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")

router.get("/", userAdminGuard, handleProductPage)

module.exports = router;
