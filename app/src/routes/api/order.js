const express = require('express');
const router = express.Router();

const {handleCreateOrder} = require("../../controllers/api/order")

router.post("/", handleCreateOrder)

module.exports = router;