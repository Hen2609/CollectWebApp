const express = require('express')
const router = express.Router()
const product = require("../../models/product")

router.get('/list', async (req,res) => {
    const products = await product.find({})
    res.render('layouts/mainlayout', {page: 'test', title: "test", data: {product: products[0]}})
})


module.exports = router;