const express = require('express');
const router = express.Router();
const {render} = require("../../utils/render")
const productController = require("../../controllers/api/product")
const categoryController = require("../../controllers/api/category")
const { isAdminUser } = require("../../utils/auth")

router.get("/", async (req,res) => {
    if(!isAdminUser(req)){
        return res.redirect('/')
    }   
    const products = await productController.getProducts()
    const categories = await categoryController.getCategories()
    render(req,res,'products', 'מוצרים', {products,categories})
})

module.exports = router;
