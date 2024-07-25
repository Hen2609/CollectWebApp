/**
 * @typedef {Object} Category
 * @property {string} _id - The unique identifier of the category
 * @property {string} name - The name of the category
 * // Add other properties as needed
 */


const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: true}
});

const CategoryModel = mongoose.model('categories', CategorySchema);

module.exports = CategoryModel
