
const CustomError = require('../utils/CustomError');
const CategoryModel = require("../models/category")

/**
 * @fileoverview This file defines the getCategories function.
 * @requires ../models/category
 * @typedef {import('../models/category').Category} Category
 */

/**
 * Retrieves all categories, optionally filtered by a search pattern.
 * @async
 * @function getAllCategories
 * @param {string} [pattern] - The search pattern to filter categories by name.
 * @returns {Promise<Category[]>} - A promise that resolves to an array of Category objects.
 * @throws {CustomError} - Throws a custom error if an error occurs during the query.
 */
const getAllCategories = async (pattern) => {
    const query = {};
    if (pattern) {
        query.name = new RegExp(pattern, 'i');
    }
    return CategoryModel.find(query);
};

/**
 * Retrieves a category by its ID.
 * @async
 * @function getCategoryById
 * @param {string} id - The ID of the category to retrieve.
 * @returns {Promise<Category>} - A promise that resolves to the category object.
 * @throws {CustomError} - Throws a custom error if the category id is not supplied or the category is not found.
 */
const getCategoryById = async (id) => {
    if (!id) {
        throw new CustomError("Must supply category id", 1);
    }
    const category = await CategoryModel.findById(id).exec();
    if (!category) {
        throw new CustomError("Category not found", 2);
    }
    return category;
};

/**
 * Creates a new category.
 * @async
 * @function createCategory
 * @param {string} name - The name of the category to create.
 * @returns {Promise<Category>} - A promise that resolves to the created category object.
 * @throws {CustomError} - Throws a custom error if the name is not supplied or is a duplicate.
 */
const createCategory = async (name) => {
    if (!name) {
        throw new CustomError("Must supply name", 1);
    }
    const validName = await CategoryModel.exists({ name: name.trim() });
    if (validName) {
        throw new CustomError("Duplicate category name", 3);
    }
    return CategoryModel.create({ name: name.trim() });
};

/**
 * Updates an existing category.
 * @async
 * @function updateCategory
 * @param {string} id - The ID of the category to update.
 * @param {string} name - The new name for the category.
 * @returns {Promise<boolean>} - A promise that resolves to true if the category was updated successfully.
 * @throws {CustomError} - Throws a custom error if the id or name is not supplied, if the name is a duplicate, or if the category is not found.
 */
const updateCategory = async (id, name) => {
    if (!id) {
        throw new CustomError("Must supply id", 1);
    }
    if (!name) {
        throw new CustomError("Must supply name", 2);
    }
    const validName = await CategoryModel.exists({ name: name.trim(), _id: { $ne: id } });
    if (validName) {
        throw new CustomError("Duplicate category name", 3);
    }
    const result = await CategoryModel.updateOne(
        { _id: id },
        { $set: { name: name.trim() } }
    );
    if (!result.matchedCount) {
        throw new CustomError("Category not found", 4);
    }
    return true;
};

/**
 * Deletes a category by its ID.
 * @async
 * @function deleteCategory
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the category was deleted successfully.
 * @throws {CustomError} - Throws a custom error if the category id is not supplied or the category is not found.
 */
const deleteCategory = async (id) => {
    if (!id) {
        throw new CustomError("Must supply category id", 1);
    }
    const result = await CategoryModel.findByIdAndDelete(id);
    if (!result) {
        throw new CustomError("Category not found", 2);
    }
    return true;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};