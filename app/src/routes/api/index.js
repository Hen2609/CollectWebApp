const express = require('express');
const router = express.Router();
const categoryRoutes = require("./category")
const productRoutes = require("./product")

router.use("/category",categoryRoutes)
router.use("/product",productRoutes)

module.exports = router;
