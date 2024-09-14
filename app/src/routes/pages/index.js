const express = require('express');
const router = express.Router();

const {handleHomepage} = require("../../controllers/pages/homepage");

const categoryRoutes = require("./category")
const productRoutes = require("./product");
const cartRoutes = require("./cart");
const privacyRoutes = require("./privacy");
const statsRoutes = require("./stats");
const orderRoutes = require("./orders");


router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/cart",cartRoutes)
router.use("/privacy",privacyRoutes)
router.use("/stats",statsRoutes)
router.use("/orders",orderRoutes)

router.get("/", handleHomepage)

router.all("*", (req,res) => {
    res.status(404).send('<h1>404! עמוד לא נמצא</h1>');
})
module.exports = router;
