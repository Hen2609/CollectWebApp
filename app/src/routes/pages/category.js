const express = require('express');
const router = express.Router();
const {handleCategoryPage} = require("../../controllers/pages/category");

router.get("/", handleCategoryPage)

module.exports = router;
