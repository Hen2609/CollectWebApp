const express = require('express');
const router = express.Router();

const {handleCreateOrder} = require("../../controllers/order")

router.post("/", handleCreateOrder)

module.exports = router;