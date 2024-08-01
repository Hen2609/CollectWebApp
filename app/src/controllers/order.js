const OrderModel = require("../models/order")
const mongoose = require("mongoose");

/**
 * @fileoverview This file defines the getOrders function.
 * @requires ../models/order
 * @typedef {import('../models/order').Order} Order
 */

/**
 * @async
 * @function getOrders
 * @param {string[] | undefined} users
 * @returns {Promise<Order[]>}
 */
async function getOrders(users){
    const query = {}
    if(users){
        query.user = {
            $in: users
        }
    }
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
 * @param {import("mongoose").ObjectId[]} products
 * @param {string} signature
 * @param {number} price
 * @param {Date} date 
 * @returns {Promise<Order>}
 */
async function createOrder(user, products, signature, price, date){
    const order = await OrderModel.create({
        user,
        products,
        signature,
        price,
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

async function ordersByProducts(){
    const result = await OrderModel.aggregate([
        { $unwind: "$products" },
        {
            $group: {
                _id: "$products", 
                totalOrders: { $sum: 1 }, 
                orders: { $push: "$_id" } 
            }
        },
        {
            $lookup: {
                from: "products", 
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                product: "$productDetails.name",
                totalOrders: 1,
                orders: 1
            }
        }
    ]);
    return result
}

async function  ordersByUsers(){
    const result = await OrderModel.aggregate([
        {
            $group: {
                _id: "$user", 
                totalSpent: { $sum: "$price" } 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id", 
                foreignField: "id", 
                as: "userDetails"
            }
        },
        {
            $addFields: {
                userDetails: { 
                    $cond: {
                        if: { $eq: [{ $size: "$userDetails" }, 0] }, 
                        then: [{ id: '', name: 'משתמש אנונימי' }], 
                        else: "$userDetails" 
                    }
                }
            }
        },
        {
            $unwind: "$userDetails"
        },
    ]);
    return result
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    ordersByProducts,
    ordersByUsers
}