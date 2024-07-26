const ProductModel = require("../models/product")
const mongoose = require("mongoose");

/**
 * @fileoverview This file defines the getProducts function.
 * @requires ../models/product
 * @typedef {import('../models/product').Product} Product
 */

/**
 * @async
 * @function getProducts
 * @param {String | undefined} namePattern
 * @param { mongoose.Types.ObjectId[] | undefined } categories
 * @returns {Promise<Product[]>}
 */
async function getProducts(namePattern, categories){
    const query = {}
    if(namePattern){
        query.name = new RegExp(namePattern, 'i');
    }
    if(categories){
        query.categories = { $in: categories }
    }
    const products = await ProductModel.find(query)
    return products
}

/**
 * @async
 * @function getProduct
 * @param {String} id
 * @returns {Promise<Product| undefined>}
 */
async function getProduct(id){
    const product = await ProductModel.findById(id).exec();
    return product
}

/** 
 * @async
 * @function isProductNameAvailable
 * @param {String} name
 * @param {String | undefined} excludeId
 * @returns {Promise<Boolean>}
 */
async function isProductNameAvailable(name, excludeId){
    const query = {
        name: name.trim(),
    }
    if(excludeId){
        query["_id"] = {$ne: excludeId}
    }
    const exist = await ProductModel.findOne(query)
    return exist ? false : true
}
/**
 * @async
 * @function createProduct
 * @param {string} name 
 * @param {mongoose.Types.ObjectId[]} categories 
 * @param {string} description 
 * @param {string} price 
 * @param {string | undefined } image 
 * @returns {Promise<Product>}
 */
async function createProduct(name, categories, description, price, image){
    const product = await ProductModel.create({
        name: name.trim(),
        categories,
        description,
        image,
        price
    })
    return product
}

/**
 * @async
 * @function updateProduct
 * @param {String} id 
 * @param {string} name 
 * @param {mongoose.Types.ObjectId[]} categories 
 * @param {string} description 
 * @param {string} price 
 * @param {string | undefined } image 
 * @returns {Promise<boolean>}
 */
async function updateProduct(id, name, categories, description, price, image){
    const product = await ProductModel.updateOne(
        { _id: id },
        { $set: { 
            name: name.trim(),
            categories,
            description,
            image,
            price
          }
        }
    );
    return product.modifiedCount !== 0
}
/**
 * @async
 * @function deleteProduct
 * @param {String} id
 * @returns {Promise<Boolean>}
 */
async function deleteProduct(id){
    const result = await ProductModel.findByIdAndDelete(id);
    return result ?  true : false
}

module.exports = {
    getProducts,
    getProduct,
    isProductNameAvailable,
    createProduct,
    updateProduct,
    deleteProduct
}