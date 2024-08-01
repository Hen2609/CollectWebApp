const express = require('express');
const router = express.Router();
const {render} = require("../../util/render")
const orderController = require("../../controllers/order")
const { isAdminUser } = require("../../util/auth")

router.get("/", async (req,res) => {
    if(!isAdminUser(req)){
        return res.redirect('/')
    }    
    const productOrders = await orderController.ordersByProducts()
    const usersOrders   = await orderController.ordersByUsers()
    render(req,res,'stats', 'סטטיסטיקה', {productOrders, usersOrders})
})

module.exports = router;
