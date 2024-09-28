
/**
 * @function userAuthenticatedGuard
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The request object, containing the body data.
 * @param {import("express").NextFunction} next - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 */

function userAuthenticatedGuard(req, res, next) {
    if (req.session.user) {
        return next();
    }
    // User is not logged in
    return res.status(401).json({ error: "Unauthorized access" });
}

/**
 * @function userAdminGuard
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The request object, containing the body data.
 * @param {import("express").NextFunction} next - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 */

function userAdminGuard(req, res, next) {
    if (isAdminUser(req)) {
        return next();
    }
    // User is not logged in
    return res.status(401).json({ error: "Unauthorized access" });
}

/**
 * @function isAdminUser
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @returns {Boolean} - isUserAdmin
 */

function isAdminUser (req) {
    return req.session.user && req.session.user?.type === "admin"
}

module.exports = {
    userAuthenticatedGuard,
    userAdminGuard,
    isAdminUser
}