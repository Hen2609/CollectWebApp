const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();

const {createOrder} = require("../../controllers/order")

router.post("/", async (req, res) => {
    if(!req.body.products){
        return res.status(400).json({error: "Must Supply Products", code: 1})
    }
    if(!req.body.price){
        return res.status(400).json({error: "Must Supply Price", code: 2})
    }
    if(!req.body.signature){
        return res.status(400).json({error: "Must Supply Siganture", code: 3})
    }
    if(!req.body.date){
        return res.status(400).json({error: "Must Supply Date", code: 4})
    }
    const price = parseFloat(req.body.price)
    if(isNaN(price)){
        return res.status(400).json({error: "Price Must be a number", code: 5})
    }
    const inital_products = Array.isArray(req.body.products) ? req.body.products : [req.body.products]
    const products = inital_products.map(product => mongoose.Types.ObjectId.createFromHexString(product))
    const order = await createOrder(req.body.user,products,req.body.signature,req.body.price, req.body.date)
    return res.status(201).json(order)
})

module.exports = router;