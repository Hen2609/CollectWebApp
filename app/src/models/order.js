const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @fileoverview This file defines the getProducts function.
 * @requires ../models/product
 * @typedef {import('../models/product').Product} Product
 */

/**
 * @typedef {Object} Order  
 * @property {string} user 
 * @property {Array<{id: import("mongoose").ObjectId, quantity: number} & Product>} products
 * @property {string} signature 
 * @property {number} price 
 * @property {Date} date 
 */


const OrderSchema = new Schema({
    user: { type: String, required: false },
    products: { type: Array, required: true },
    signature: {type: String, required: true },
    price: {type: Number, required: true },
    date: {type: Date, required: true }
});

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel
