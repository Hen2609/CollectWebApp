const express = require('express')

const router = express.Router()
const product = require("../../models/product")
const render = require("../../util/render")


router.get('/product', async (req,res) => {
    const products = await product.find({})
    render(req,res,'test','test',{product: products[0]})
})

router.post('/product', async (req,res) => {
    console.log('req',req.body.name)
    console.log('s',sanitize(req.body.name))
    req.body.name = sanitize(req.body.name)
    const products = await product.find(req.body.name)
    res.send(products)
})


module.exports = router;