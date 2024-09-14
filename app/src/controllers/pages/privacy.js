const {render} = require("../../utils/render")

/**
 * Handles rendering of privacy page
 * @async
 * @function handlePrivacyPage
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 * @return {Promise<void>} A promise that resolves when the logout process completes.
 */
async function handlePrivacyPage(req, res){
    render(req,res,'privacy', 'מדיניות פרטיות', {})
}

module.exports =  {
    handlePrivacyPage
}
