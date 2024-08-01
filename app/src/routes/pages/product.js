const express = require('express');
const router = express.Router();
const {render} = require("../../util/render")
const productController = require("../../controllers/product")
const categoryController = require("../../controllers/category")

router.get("/", async (req,res) => {
    const products = await productController.getProducts()
    const categories = await categoryController.getCategories()
    render(req,res,'products', 'מוצרים', {products,categories})
})

module.exports = router;
