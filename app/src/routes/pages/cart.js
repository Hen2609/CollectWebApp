const express = require('express');
const router = express.Router();
const {handleCartPage} = require("../../controllers/pages/cart")


router.get("/", handleCartPage);

module.exports = router;
