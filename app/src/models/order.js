const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * @typedef {Object} Order  
 * @property {string} user 
 * @property {Array<{id: import("mongoose").ObjectId, quantity: number}>} products
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
