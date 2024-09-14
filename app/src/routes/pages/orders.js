const express = require('express');
const router = express.Router();
const {handleOrdersPage} = require('../../controllers/pages/orders');
router.get("/", handleOrdersPage)

module.exports = router;
