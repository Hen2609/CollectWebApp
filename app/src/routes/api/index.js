const express = require('express');
const router = express.Router();

const { isAdminUser } = require("../../util/auth")

const categoryRoutes = require("./category")
const productRoutes = require("./product")
const userRoutes = require("./user")
const locationRoutes = require("./location")
const orderRoutes = require("./order")

const excludedGetPaths = ['/location','/product/card']
const excludedPostPaths = ['/order','/user/signup', '/user/login']

router.use("/", (req, res, next) => {
    if(req.method === 'GET' && excludedGetPaths.some(path => req.path.includes(path)) ){
        next()
    }
    else if(!isAdminUser(req) && !excludedPostPaths.includes(req.path)){
        res.status(403).send("unauthorized")
    }else {
        next()
    }
})
router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/user",userRoutes)
router.use("/location",locationRoutes)
router.use("/order",orderRoutes)

module.exports = router;
