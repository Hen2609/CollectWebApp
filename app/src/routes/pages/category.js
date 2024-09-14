const express = require('express');
const router = express.Router();
const {render} = require("../../utils/render")
const categoryController = require("../../controllers/category")
const { isAdminUser } = require("../../utils/auth")

router.get("/", async (req,res) => {
    if(!isAdminUser(req)){
        return res.redirect('/')
    }    
    const categories = await categoryController.getCategories()
    render(req,res,'categories', 'קטגוריות', {categories})
})

module.exports = router;
