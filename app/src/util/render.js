const { Request, Response } = require('express');
const formatters = require("../util/formatters")
/**
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} page - The name of the page to render.
 * @param {string} title - The title to be passed to the template.
 * @param {Object|undefined} data - The data passed to the template.
 */
function render (req, res, page, title,data) {
    res.render('layouts/mainlayout', {page, title, data, user: undefined, utils: {
        formatters
    }})
}

module.exports = render;