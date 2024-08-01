const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @typedef {Object} User
 * @property {string} id 
 * @property {string} name 
 * @property {string} password 
 * @property {string} type 
 */




const UserSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel
