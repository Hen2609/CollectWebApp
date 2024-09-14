
/**
 * @function isAdminUser
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @returns {Boolean} - adminUser
 */
function isAdminUser (req) {
    return req.session.user && req.session.user?.type === "admin"
}

module.exports = {
    isAdminUser
}