const { Request } = require('express');

/**
 * @function isAdminUser
 * @param {Request} req - The Express request object.
 * @returns {Boolean} - adminUser
 */
function isAdminUser (req) {
    return req.session.user && req.session.user?.type === "admin"
}

module.exports = {
    isAdminUser
}