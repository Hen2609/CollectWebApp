const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name 
 * @property {import("mongoose").Types.ObjectId[]} categories
 * @property {string} description 
 * @property {string} price 
 * @property {string} image 
 */




const ProductSchema = new Schema({
    name: { type: String, required: true },
    categories: { type: [mongoose.Types.ObjectId], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
});

const ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel
