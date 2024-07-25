const {Request, Response} = require("express")
const CategoryModel = require("../models/category")

/**
 * @fileoverview This file defines the getCategories function.
 * @requires ../models/category
 * @typedef {import('../models/category').Category} Category
 */


/**
 * @async
 * @function getCategories
 * @param {String | undefined } pattern
 * @returns {Promise<Category[]>}
 */
async function getCategories(pattern){
    const query = {}
    if(pattern){
        const searchPattern = new RegExp(pattern.replace(/^"|"$/g, ''), 'i');
        query.name = searchPattern
    }
    const categories = await CategoryModel.find(query)
    return categories
}

/**
 * @async
 * @function getCategory
 * @param {String} id
 * @returns {Promise<Category| undefined>}
 */
async function getCategory(id){
    const category = await CategoryModel.findById(id).exec();
    return category
}

/** 
 * @async
 * @function isCategoryNameAvailable
 * @param {String} name
 * @param {String | undefined} excludeId
 * @returns {Promise<Boolean>}
 */
async function isCategoryNameAvailable(name, excludeId){
    const query = {
        name: name.trim(),
    }
    if(excludeId){
        query["_id"] = {$ne: excludeId}
    }
    const exist = await CategoryModel.findOne(query)
    return exist ? false : true
}
/**
 * @async
 * @function createCategory
 * @param {String} name
 * @returns {Promise<Category>}
 */
async function createCategory(name){
    const category = await CategoryModel.create({
        name: name
    })
    return category
}

/**
 * @async
 * @function updateCategory
 * @param {String} id 
 * @param {String} name
 * @returns {Promise<boolean>}
 */
async function updateCategory(id, name){
    const category = await CategoryModel.updateOne(
        { _id: id },
        { $set: { name: name.trim() } }
    );
    return category.modifiedCount !== 0
}
/**
 * @async
 * @function deleteCategory
 * @param {String} id
 * @returns {Promise<Boolean>}
 */
async function deleteCategory(id){
    const result = await CategoryModel.findByIdAndDelete(id);
    return result ?  true : false
}

module.exports = {
    getCategories,
    getCategory,
    isCategoryNameAvailable,
    createCategory,
    updateCategory,
    deleteCategory
}