const {render} = require("../../utils/render")
const {isAdminUser} = require("../../utils/auth");
const { getOrders } = require("../../services/order");

/**
 * Handles rendering of orders page
 * @async
 * @function handleOrdersPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} req.session - The session object, used to handle user sessions.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleOrdersPage(req, res){
    let usersFilter = []
    const admin = isAdminUser(req)
    if(admin){
        usersFilter = undefined
    } else if(req.session.user ){
        usersFilter = [req.session.user.id]
    }
    const orders = await getOrders(usersFilter)
    render(req,res,'orders', 'הזמנות', {orders, admin})
}

module.exports =  {
    handleOrdersPage
}
