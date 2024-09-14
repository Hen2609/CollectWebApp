const UserModel = require("../models/user")
const crypto = require('crypto')
const {CustomError, CustomerErrorGenerator} = require("../utils/customError");
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
    return !!user
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
 * @param {String} id
 * @param {String} password
 * @returns {Promise<User>}
 * @throws {CustomError} Throws an error if:
 * - user validation fails.
 */
async function login(id,password){
    const errorGenerator = new CustomerErrorGenerator("USR_SRV_LOGIN")

    if(!id){
        throw errorGenerator.generate("Must supply id", 1)
    }
    if(!password){
        throw errorGenerator.generate("Must supply password", 2)
    }
    const query = {
        id,
        password: hashPassword(password)
    }
    return UserModel.findOne(query);
}

/**
 * @async
 * @function signUp
 * @param {String} id
 * @param {String} name
 * @param {String} password
 * @returns {Promise<User>}
 * @throws {CustomError} Throws an error if:
 * - user validation fails.
 */
async function signUp(id,name, password){
    const errorGenerator = new CustomerErrorGenerator("USR_SRV_SIGNUP")
    if(!id){
        throw errorGenerator.generate("Must supply id", 1)
    }
    if(!name){
        throw errorGenerator.generate("Must supply name", 2)
    }
    if(!password){
        throw errorGenerator.generate("Must supply password", 3)
    }
    if(await doesUserExist(id)){
        throw errorGenerator.generate("duplicate user", 4)
    }
    const query = {
        id,
        name,
        password: hashPassword(password)
    }
    return UserModel.create(query);
}

module.exports = {
    doesUserExist,
    login,
    signUp
}