const express = require('express');
const router = express.Router();

const { handlePrivacyPage } = require('../../controllers/pages/privacy');

router.get("/", handlePrivacyPage)

module.exports = router;
