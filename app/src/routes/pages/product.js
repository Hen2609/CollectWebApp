const express = require('express');
const router = express.Router();

const {handleProductPage} = require("../../controllers/pages/product");

router.get("/", handleProductPage)

module.exports = router;
