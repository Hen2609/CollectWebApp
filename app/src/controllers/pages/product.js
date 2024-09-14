const {render} = require("../../utils/render")
const {isAdminUser} = require("../../utils/auth");
const {getAllCategories} = require("../../services/category")
const {getProducts} = require("../../services/product")

/**
 * Handles rendering of product page
 * @async
 * @function handlePrivacyPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleProductPage(req, res){
    if(!isAdminUser(req)){
        return res.redirect('/')
    }
    const products = await getProducts()
    const categories = await getAllCategories()
    render(req,res,'products', 'מוצרים', {products,categories})
}

module.exports =  {
    handleProductPage
}
