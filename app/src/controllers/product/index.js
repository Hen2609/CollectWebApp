const express = require('express')
const router = express.Router()
const product = require("../../models/product")

router.get('/list', async (req,res) => {
    const products = await product.find({})
    res.render('pages/test', {product: products[0]})
})


module.exports = router;