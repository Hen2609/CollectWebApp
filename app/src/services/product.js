const ProductModel = require("../models/product")
const {CustomError, CustomerErrorGenerator} = require("../utils/customError");

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
    const errorGenerator = new CustomerErrorGenerator("PRD_SRV_GET")
    if(!id){
          throw errorGenerator.generate("Must Supply Product ID", 1);
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
    const errorGenerator = new CustomerErrorGenerator("PRD_SRV_CREATE")

    const error = await validateProduct(errorGenerator, name, categories, description, price, undefined)
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
    const errorGenerator = new CustomerErrorGenerator("PRD_SRV_UPDATE")

    if(!id){
        throw errorGenerator.generate("Must Supply Product ID", 8);
    }
    const error = await validateProduct(errorGenerator, name, categories, description, price, id)
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
    const errorGenerator = new CustomerErrorGenerator("PRD_SRV_DELETE")

    if (!id) {
        throw errorGenerator.generate("Must Supply product id", 1)
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
 * @param {CustomerErrorGenerator} errorGenerator - The name of the product.
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
async function validateProduct(errorGenerator, name, categories, description, price, id){
    if(!name){
        return errorGenerator.generate("Must supply name", 1);
    }
    if(!categories){
        return errorGenerator.generate("Must supply categories", 2)
    }
    if(!description){
        return  errorGenerator.generate("Must supply description", 3)
    }
    if(!price){
        return errorGenerator.generate("Must supply price", 4)
    }
    const parsed_price = parseFloat(req.body.price)
    if(isNaN(parsed_price)){
        return errorGenerator.generate("Price Must be a number", 5);
    }
    const valid_name = await isProductNameAvailable(name, id)
    if(!valid_name){
        return errorGenerator.generate("Duplicate product name", 7)
    }
}

module.exports = {
    getProducts,
    getProduct,
    isProductNameAvailable,
    createProduct,
    updateProduct,
    deleteProduct,
}