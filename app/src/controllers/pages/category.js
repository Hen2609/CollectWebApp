const {render} = require("../../utils/render")
const {isAdminUser} = require("../../utils/auth");
const {getAllCategories} = require("../../services/category");

/**
 * Handles rendering of category page
 * @async
 * @function handleCategoryPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleCategoryPage(req, res){
    if(!isAdminUser(req)){
        return res.redirect('/')
    }
    const categories = await getAllCategories()
    render(req,res,'categories', 'קטגוריות', {categories})
}

module.exports =  {
    handleCategoryPage
}
