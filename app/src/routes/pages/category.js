const express = require('express');
const router = express.Router();
const {handleCategoryPage} = require("../../controllers/pages/category");
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")

router.get("/", userAdminGuard, handleCategoryPage)

module.exports = router;
