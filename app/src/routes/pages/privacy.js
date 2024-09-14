const express = require('express');
const router = express.Router();
const {render} = require("../../utils/render")

router.get("/", async (req,res) => {
    render(req,res,'privacy', 'מדיניות פרטיות', {})
})

module.exports = router;
