const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/** 
 *  @typedef {Object} OrderProduct
 *  @property {import("./product").Product} product
 *  @property {Number} quantity
 */
/**
 * @typedef {Object} Order
 * @property {string} user 
 * @property {Array<OrderProduct>} products 
 * @property {string} signature 
 * @property {Date} date 
 */



const OrderSchema = new Schema({
    user: { type: String, required: true },
    products: { type: Array, required: true },
    signature: {type: String, required: true },
    date: {type: Date, required: true }
});

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel
