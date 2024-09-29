const {render} = require("../../utils/render")
const {isAdminUser} = require("../../utils/auth");
const {ordersByProducts, ordersByUsers, getBestSellingCategories} = require("../../services/order");

/**
 * Handles rendering of product page
 * @async
 * @function handleStatsPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleStatsPage(req, res){
    if(!isAdminUser(req)){
        return res.redirect('/')
    }
    const usersOrders   = await ordersByUsers()
    const bestSelling   =  await getBestSellingCategories()
    render(req,res,'stats', 'סטטיסטיקה', {bestSelling, usersOrders})
}

module.exports =  {
    handleStatsPage
}
