const { getAllCategories } = require("../../services/category")
const {getProducts} = require("../../services/product")
const mongoose = require("mongoose");
const {render} = require("../../utils/render");

/**
 * Handles rendering of homepage
 * @async
 * @function handleHomepage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleHomepage(req, res){
    const categories = await getAllCategories()
    let categories_filter = []
    if(req.query.categories){
        categories_filter = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]
    }
    categories_filter = categories_filter.map(cat => mongoose.Types.ObjectId.createFromHexString(cat))
    const search = req.query.search ? req.query.search : undefined
    const products = await getProducts(search,categories_filter)

    render(req,res,'homepage','קודש SQUAD', {
        categories,
        products
    })
}

module.exports =  {
    handleHomepage
}
