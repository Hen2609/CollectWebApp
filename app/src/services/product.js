const ProductModel = require("../models/product")
const CustomError = require("../utils/customError");

/**
 * @fileoverview This file defines the getProducts function.
 * @requires ../models/product
 * @typedef {import('../models/product').Product} Product
 */

/**
 * @async
 * @function getProducts
 * @param {String | undefined} namePattern
 * @param {import("mongoose").Types.ObjectId[] | undefiend} categories
 * @returns {Promise<Product[]>}
 */
async function getProducts(namePattern, categories){
    const query = {}
    if(namePattern){
        query.name = new RegExp(namePattern, 'i');
    }
    if(categories && categories.length > 0){
        query.categories = { $in: categories }
    }
    return ProductModel.find(query);
}

/**
 * @async
 * @function getProduct
 * @param {String} id
 * @returns {Promise<Product| undefined>}
 */
async function getProduct(id){
      if(!id){
          throw new CustomError("Must Supply Order ID", 6);
      }
    const [product] = await Promise.all([ProductModel.findById(id).exec()]);
    return product
}

/**
 * @async
 * @function createProduct
 * @param {string} name
 * @param {import("mongoose").Types.ObjectId[]} categories
 * @param {string} description
 * @param {string} price
 * @param {string | undefined } image
 * @returns {Promise<Product>}
 * @throws {CustomError} Throws an error if:
 * - product validation fails.
 */
async function createProduct(name, categories, description, price, image){
    const error = await validateProduct(name, categories, description, price)
    if(error){
        throw error;
    }
    return await ProductModel.create({
        name: name.trim(),
        categories,
        description,
        image,
        price
    })
}

/**
 * @async
 * @function updateProduct
 * @param {String} id
 * @param {string} name
 * @param {import("mongoose").Types.ObjectId[]} categories
 * @param {string} description
 * @param {string} price
 * @param {string | undefined } image
 * @returns {Promise<boolean>}
 * @throws {CustomError} Throws an error if:
 * - product validation fails.
 */
async function updateProduct(id, name, categories, description, price, image){
    if(!id){
        throw new CustomError("Must Supply Product ID", 8);
    }
    const error = await validateProduct(name, categories, description, price, id)
    if(error){
        throw error;
    }
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
 * @throws {CustomError} Throws an error if:
 * - product id was not defined.
 */
async function deleteProduct(id){
    if (!id) {
        throw new CustomError("Must Supply product id", 1)
    }
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result
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
    return !exist
}

/**
 * Validates the product information.
 *
 * @async
 * @function validateProduct
 * @param {string} name - The name of the product.
 * @param {import("mongoose").Types.ObjectId[]} categories - The categories the product belongs to.
 * @param {string} description - The description of the product.
 * @param {string} price - The price of the product.
 * @param {String | undefined } id - The price of the product.
 * @returns {Promise<CustomError | undefined>} - Returns a CustomError if validation fails, otherwise undefined.
 *
 * @throws {CustomError} Throws an error if:
 * - name is not provided.
 * - categories are not provided.
 * - description is not provided.
 * - price is not provided.
 * - price is not a valid number.
 * - product name is not available (duplicate).
 */
async function validateProduct(name, categories, description, price, id){
    if(!name){
        return new CustomError("Must supply name", 1);
    }
    if(!categories){
        return new CustomError("Must supply categories", 2)
    }
    if(!description){
        return  new CustomError("Must supply description", 3)
    }
    if(!price){
        return new CustomError("Must supply price", 4)
    }
    const parsed_price = parseFloat(req.body.price)
    if(isNaN(parsed_price)){
        return new CustomError("Price Must be a number", 5);
    }
    const valid_name = await isProductNameAvailable(name, id)
    if(!valid_name){
        return new CustomError("Duplicate product name", 7)
    }
}

module.exports = {
    getProducts,
    getProduct,
    isProductNameAvailable,
    createProduct,
    updateProduct,
    deleteProduct
}