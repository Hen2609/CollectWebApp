const express = require('express');
const router = express.Router();
const {render} = require("../../utils/render")
const orderController = require("../../controllers/order")
const { isAdminUser } = require("../../utils/auth")

router.get("/", async (req,res) => {
    if(!isAdminUser(req)){
        return res.redirect('/')
    }    
    const productOrders = await orderController.ordersByProducts()
    const usersOrders   = await orderController.ordersByUsers()
    render(req,res,'stats', 'סטטיסטיקה', {productOrders, usersOrders})
})

module.exports = router;
