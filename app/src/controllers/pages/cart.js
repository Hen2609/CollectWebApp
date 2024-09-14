const {render} = require("../../utils/render")

/**
 * Handles rendering of cart page
 * @async
 * @function handleCartPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handleCartPage(req, res){
    render(req,res,'cart', 'עגלה', {})
}

module.exports =  {
    handleCartPage
}
