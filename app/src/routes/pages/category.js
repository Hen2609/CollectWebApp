const express = require('express');
const router = express.Router();
const redner = require("../../util/render")
const categoryController = require("../../controllers/category")

router.get("/", async (req,res) => {
    const categories = await categoryController.getCategories()
    redner(req,res,'categories', 'קטגוריות', {categories})
})

module.exports = router;
