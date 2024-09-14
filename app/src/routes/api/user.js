const express = require('express');

const router = express.Router();
const {
    handleLogout, handleSignUp, handleLogin
} = require('../../controllers/user');

router.post("/logout", handleLogout)

router.post("/signup", handleSignUp)

router.post("/login", handleLogin)

module.exports = router;