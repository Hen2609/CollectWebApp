const express = require('express');
const router = express.Router();
const categoryRoutes = require("./category")

router.use("/category",categoryRoutes)

module.exports = router;
