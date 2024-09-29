const express = require('express');
const router = express.Router();

const { isAdminUser } = require("../../utils/auth")

const categoryRoutes = require("./category")
const productRoutes = require("./product")
const userRoutes = require("./user")
const locationRoutes = require("./location")
const orderRoutes = require("./order")


router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/user",userRoutes)
router.use("/location",locationRoutes)
router.use("/order",orderRoutes)

module.exports = router;
