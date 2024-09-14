const orderService = require('../../services/order');
const {CustomError} = require('../../utils/customError');
const mongoose = require("mongoose");
const {sendOrderCreatedEmail} = require("../../services/email");

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
        const final_products = initial_products.map(product => {
            return {
                id: mongoose.Types.ObjectId.createFromHexString(product.id),
                quantity: product.quantity,
            }
        })
        const order = await orderService.createOrder(user, final_products, signature, price, new Date(date));
        await sendOrderCreatedEmail(order).catch(err => console.error(err));
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