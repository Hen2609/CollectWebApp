const orderService = require('../services/order');
const CustomError = require('../utils/CustomError');
const mongoose = require("mongoose");

/**
 * Handles the request to create a new order.
 *
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 */

const handleCreateOrder = async (req, res) => {
    try {
        const { user, products, signature, price, date } = req.body;
        const initial_products = Array.isArray(products) ? products : [products]
        const final_products = initial_products.map(product => mongoose.Types.ObjectId.createFromHexString(product))
        const order = await orderService.createOrder(user, final_products, signature, price, date);
        return res.status(201).json(order);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({ error: error.message, code: error.errorCode });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    handleCreateOrder,
};