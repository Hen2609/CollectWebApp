const UserModel = require("../models/user")
const crypto = require('crypto')
/**
 * @fileoverview This file defines the getCategories function.
 * @requires ../models/user
 * @typedef {import('../models/user').User} User
 */

/**
 * @async
 * @function doesUserExist
 * @param {String} name
 * @returns {Promise<Boolean>}
 */
async function doesUserExist(name){
    const query = {
        name
    }
    const user = await UserModel.findOne(query) 
    return user ? true : false
}

/**
 * @function hasPassword
 * @param {String} password
 * @returns {String}
 */
function hashPassword(password){
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

/**
 * @async
 * @function login
 * @param {String} name
 * @param {String} password
 * @returns {Promise<User>}
 */
async function login(id,password){
    const query = {
        id,
        password: hashPassword(password)
    }
    const user = await UserModel.findOne(query) 
    return user 
}

/**
 * @async
 * @function signUp
 * @param {String} id
 * @param {String} name
 * @param {String} password
 * @returns {Promise<User>}
 */
async function signUp(id,name, password){
    const query = {
        id,
        name,
        password: hashPassword(password)
    }
    const user = await UserModel.create(query) 
    return user
}

module.exports = {
    doesUserExist,
    login,
    signUp
}