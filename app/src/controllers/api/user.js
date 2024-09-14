
const {
    signUp, login
} = require("../../services/user")
const {CustomError} = require("../../utils/customError");

/**
 * Handles user sign-up by processing incoming request data and generating an appropriate response.
 * @async
 * @function handleSignUp
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} - A promise that resolves when the sign-up process is complete.
 */
async function handleSignUp(req, res){
    let user;
    try {
        user = await signUp(req.body.id, req.body.name,  req.body.password)
    }catch (error){
        if(error instanceof CustomError){
            res.status(400).json({error: error.message, code: error.code})
        }
        res.status(500).json({error: error.message})
    }
    if(user){
        req.session.user = user
        res.status(201).json(user)
    }else  {
        res.status(500).json({error: "failed to signup", code: 5})
    }
}

/**
 * Handles the login process for the user.
 * @async
 * @function handeLogin
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} - A promise that resolves when the login process is completed.
 */
async function handleLogin(req, res){
    let user;
    try {
        user = await login(req.body.id, req.body.password)
    }catch (error){
        if(error instanceof CustomError){
            res.status(400).json({error: error.message, code: error.code})
        }
        res.status(500).json({error: error.message})
    }
    if(user){
        req.session.user = user
        res.status(200).json(user)
    }else  {
        res.status(500).json({error: "failed to login", code: 3})
    }
}

/**
 * Handles user logout by invalidating the session or token
 * and sending an appropriate response.
 * @async
 * @function handleLogout
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleLogout(req, res){
    req.session.destroy()
    res.status(200).json({})
}

module.exports = {
    handleSignUp,
    handleLogin,
    handleLogout
}