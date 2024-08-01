const express = require('express');
const router = express.Router();
const {render} = require("../../util/render")
const productController = require("../../controllers/product")
const categoryController = require("../../controllers/category")
const { isAdminUser } = require("../../util/auth")

router.get("/", async (req,res) => {
    if(!isAdminUser(req)){
        return res.redirect('/')
    }   
    const products = await productController.getProducts()
    const categories = await categoryController.getCategories()
    render(req,res,'products', 'מוצרים', {products,categories})
})

module.exports = router;
