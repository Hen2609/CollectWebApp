const OrderModel = require("../models/order");
const { CustomError, CustomerErrorGenerator} = require("../utils/customError");

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
    const match = users && users.length ? {$match: { user: {$in: users} }} : {
        $match: {}
    };
    return OrderModel.aggregate([
        match,
        {
            $lookup: {
                from: "products",
                localField: "products.id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $addFields: {
                products: {
                    $map: {
                        input: "$products",
                        as: "orderProducts",
                        in: {
                            $mergeObjects: [
                                "$$orderProducts", {
                                    $arrayElemAt:[
                                        {
                                            $filter: {
                                                input: "$productDetails",
                                                as: "productDetail",
                                                cond: { $eq: ["$$productDetail._id", "$$orderProducts.id"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                productDetails: 0
            }
        }
    ])
}

/**
 * @async
 * @function getOrder
 * @param {String} id
 * @returns {Promise<Order| undefined>}
 * @throws {CustomError}
 */
async function getOrder(id){
    const errorGenerator = new CustomerErrorGenerator("ORD_SRV_GET")

    if (!id) {
        throw errorGenerator.generate("Must Supply Order ID", 1);
    }
    let orderRes;
    try {
        [order] = await Promise.all([OrderModel.findById(id).exec()]);
        orderRes = order
    } catch (error) {
        throw errorGenerator.generate(`Error fetching order: ${error.message}`, 2);
    }
    if (!orderRes) {
        throw errorGenerator.generate(`Order not found for ID: ${id}`, 3);
    }
}

/**
 * @async
 * @function createOrder
 * @param {string} user
 * @param {{id: import("mongoose").Types.ObjectId, quantity: number}[]} products
 * @param {string} signature
 * @param {number} price
 * @param {Date} date
 * @returns {Promise<Order>}
 * @throws {CustomError}
 */
async function createOrder(user, products, signature, price, date){
    const errorGenerator = new CustomerErrorGenerator("ORD_SRV_CREATE")
    if (!products || !Array.isArray(products)) {
        throw errorGenerator.generate("Must Supply Products", 1);
    }
    if (!price) {
        throw errorGenerator.generate("Must Supply Price", 2);
    }
    if (!signature) {
        throw errorGenerator.generate("Must Supply Signature", 3);
    }
    if (!date) {
        throw errorGenerator.generate("Must Supply Date", 4);
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        throw errorGenerator.generate("Price Must be a number", 5);
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
        if(error instanceof CustomError) {
            throw errorGenerator.generate(`Error creating order: ${error.code}: ${error.message}`, 6);
        }else {
            throw errorGenerator.generate(`Error creating order: ${error.message}`, 6);
        }
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
    const errorGenerator = new CustomerErrorGenerator("ORD_SRV_DELETE")

    if (!id) {
        throw errorGenerator.generate("Must Supply Order ID", 1);
    }
    let result;
    try {
        result = await OrderModel.findByIdAndDelete(id);
    } catch (error) {
        throw errorGenerator.generate(`Error deleting order: ${error.message}`, 2);
    }
    if (!result) {
        throw errorGenerator.generate(`Order not found for ID: ${id}`, 3);
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

/**
 * @async
 * @function getProductsOfOrder
 * @param {import("mongoose").Types.ObjectId} order_id
 * @returns {Promise<Product[]>}
 */
async function getProductsOfOrder(order_id){
    const res = await OrderModel.aggregate([
        { $match: { _id: order_id } },
        { $lookup: {
                from: "products",
                localField: "products.id",
                foreignField: "_id",
                as: "order_products"
            }
        },
        {
            $project: {
                _id: 0,
                order_products: 1
            }
        }
    ]);
    return res?.[0]?.order_products ?? []
}

function getBestSellingCategories(){
    return OrderModel.aggregate([
        {$unwind: "$products"},
        {
            $group: {
                _id: "$products.id",
                totalSold: {$sum:  {$toInt: "$products.quantity" }},
            }
        },
        {
            $project: {
                _id: 1,
                totalSold: 1 // Project totalSold to check its value
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
        { $unwind: "$productDetails" },
        {
            $addFields: {
                "productDetails.totalSold": "$totalSold"
            }
        },
        { $unwind: "$productDetails.categories" },
        {
            $group: {
                _id: "$productDetails.categories",
                totalSold: { $sum: "$productDetails.totalSold" } // Correctly sum totalSold by category
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        { $unwind: "$categoryDetails" },
        {
            $addFields: {
                "categoryDetails.totalSold": "$totalSold"
            }
        },
        {
            $group: {
                "_id": "$categoryDetails._id",
                totalSold: { $sum: "$categoryDetails.totalSold" },
                categoryDetail: { $first: "$categoryDetails" }
            }
        },{
            $project: {
                _id: "$categoryDetail._id",
                name: "$categoryDetail.name",
                totalSold: "$totalSold"

            }
        }
    ]);
}

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    ordersByProducts,
    ordersByUsers,
    getProductsOfOrder,
    getBestSellingCategories
};