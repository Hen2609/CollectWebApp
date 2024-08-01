const OrderModel = require("../models/order")
const mongoose = require("mongoose");

/**
 * @fileoverview This file defines the getOrders function.
 * @requires ../models/order
 * @typedef {import('../models/order').Order} Order
 */
/**
 * @fileoverview This file defines the getOrders function.
 * @requires ../models/order
 * @typedef {import('../models/order').OrderProduct} OrderProduct
 */

/**
 * @async
 * @function getOrders
 * @returns {Promise<Order[]>}
 */
async function getOrders(){
    const query = {}
    const orders = await OrderModel.find(query)
    return orders
}

/**
 * @async
 * @function getOrder
 * @param {String} id
 * @returns {Promise<Order| undefined>}
 */
async function getOrder(id){
    const order = await OrderModel.findById(id).exec();
    return order
}
/**
 * @async
 * @function createOrder
 * @param {string} user 
 * @param {OrderProduct[]} products
 * @param {string} signature
 * @param {Date} date 
 * @returns {Promise<Order>}
 */
async function createOrder(user, products, signature, date){
    const order = await OrderModel.create({
        user,
        products,
        signature,
        date
    })
    return order
}

/**
 * @async
 * @function deleteOrder
 * @param {String} id
 * @returns {Promise<Boolean>}
 */
async function deleteOrder(id){
    const result = await OrderModel.findByIdAndDelete(id);
    return result ?  true : false
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder
}