const express = require('express');
const router = express.Router();
const categoryRoutes = require("./category")
const productRoutes = require("./product")
const userRoutes = require("./user")
const locationRoutes = require("./location")

router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/user",userRoutes)
router.use("/location",locationRoutes)

module.exports = router;
