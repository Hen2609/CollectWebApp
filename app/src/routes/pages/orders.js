const express = require('express');
const router = express.Router();
const {render} = require("../../utils/render")
const orderController = require("../../controllers/api/order")

router.get("/", async (req,res) => {
    let usersFilter = []
    const admin = req.session.user && req.session.user.type === 'admin'
    if(admin){
        usersFilter = undefined
    } else if(req.session.user ){
        usersFilter = [req.session.user.id]
    }
    const orders = await orderController.getOrders(usersFilter)
    render(req,res,'orders', 'הזמנות', {orders, admin})
})

module.exports = router;
