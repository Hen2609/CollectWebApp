
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    categories: { type: [mongoose.Types.ObjectId], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
});

const ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel
