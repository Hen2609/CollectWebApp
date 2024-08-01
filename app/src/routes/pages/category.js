const express = require('express');
const router = express.Router();
const {render} = require("../../util/render")
const categoryController = require("../../controllers/category")

router.get("/", async (req,res) => {
    const categories = await categoryController.getCategories()
    render(req,res,'categories', 'קטגוריות', {categories})
})

module.exports = router;
