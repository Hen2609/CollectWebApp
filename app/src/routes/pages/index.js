const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const { render } = require('../../util/render');

const categoriesController = require("../../controllers/category")
const productsController = require("../../controllers/product")

const categoryRoutes = require("./category")
const productRoutes = require("./product");
const cartRoutes = require("./cart");


router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/cart",cartRoutes)
router.get("/", async (req, res) => {
    const categories = await categoriesController.getCategories()
    let categories_filter = []
    if(req.query.categories){
        categories_filter = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]
    }
    categoriesFilter = categories_filter.map(cat => mongoose.Types.ObjectId.createFromHexString(cat))
    const search = req.query.search ? req.query.search : undefined
    const products = await productsController.getProducts(search,categoriesFilter)

    render(req,res,'homepage','קודש SQUAD', {
        categories,
        products
    })
})
router.all("*", (req,res) => {
    res.status(404).send('<h1>404! עמוד לא נמצא</h1>');
})
module.exports = router;
