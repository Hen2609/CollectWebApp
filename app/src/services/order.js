const OrderModel = require("../models/order");
const CustomError = require("../utils/customError");

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
 * @throws {CustomError}
 */
async function getOrders(users){
    const query = {}
    if(users){
        query.user = {
            $in: users
        }
    }
    return OrderModel.find(query);
}

/**
 * @async
 * @function getOrder
 * @param {String} id
 * @returns {Promise<Order| undefined>}
 * @throws {CustomError}
 */
async function getOrder(id){
    if (!id) {
        throw new CustomError("Must Supply Order ID", 6);
    }
    let orderRes;
    try {
        [order] = await Promise.all([OrderModel.findById(id).exec()]);
        orderRes = order
    } catch (error) {
        throw new CustomError(`Error fetching order: ${error.message}`, 8);
    }
    if (!orderRes) {
        throw new CustomError(`Order not found for ID: ${id}`, 7);
    }
}

/**
 * @async
 * @function createOrder
 * @param {string} user
 * @param {import("mongoose").Types.ObjectId[]} products
 * @param {string} signature
 * @param {number} price
 * @param {Date} date
 * @returns {Promise<Order>}
 * @throws {CustomError}
 */
async function createOrder(user, products, signature, price, date){
    if (!products || !Array.isArray(products)) {
        throw new CustomError("Must Supply Products", 1);
    }
    if (!price) {
        throw new CustomError("Must Supply Price", 2);
    }
    if (!signature) {
        throw new CustomError("Must Supply Signature", 3);
    }
    if (!date) {
        throw new CustomError("Must Supply Date", 4);
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        throw new CustomError("Price Must be a number", 5);
    }

    try {
        return await OrderModel.create({
            user,
            products,
            signature,
            price: parsedPrice,
            date
        });
    } catch (error) {
        throw new CustomError(`Error creating order: ${error.message}`, 9);
    }
}

/**
 * @async
 * @function deleteOrder
 * @param {String} id
 * @returns {Promise<Boolean>}
 * @throws {CustomError}
 */
async function deleteOrder(id){
    if (!id) {
        throw new CustomError("Must Supply Order ID", 6);
    }
    let result;
    try {
        result = await OrderModel.findByIdAndDelete(id);
    } catch (error) {
        throw new CustomError(`Error deleting order: ${error.message}`, 10);
    }
    if (!result) {
        throw new CustomError(`Order not found for ID: ${id}`, 7);
    }
    return !!result;
}

async function ordersByProducts(){
    return OrderModel.aggregate([
        {$unwind: "$products"},
        {
            $group: {
                _id: "$products",
                totalOrders: {$sum: 1},
                orders: {$push: "$_id"}
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
}

async function  ordersByUsers(){
    return OrderModel.aggregate([
        {
            $group: {
                _id: "$user",
                totalSpent: {$sum: "$price"}
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
                        if: {$eq: [{$size: "$userDetails"}, 0]},
                        then: [{id: '', name: 'משתמש אנונימי'}],
                        else: "$userDetails"
                    }
                }
            }
        },
        {
            $unwind: "$userDetails"
        },
    ]);
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    ordersByProducts,
    ordersByUsers
};