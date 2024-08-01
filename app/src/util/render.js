const { Request, Response } = require('express');
const formatters = require("../util/formatters")
const utils = {
    formatters
}
/**
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} page - The name of the page to render.
 * @param {string} title - The title to be passed to the template.
 * @param {Object|undefined} data - The data passed to the template.
 */
function render (req, res, page, title,data) {
    res.render('layouts/mainlayout', {page, title, data, user: req.session.user, utils})
}
/**
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} component - The name of the component to render.
 * @param {Object|undefined} data - The data passed to the template.
 */
function renderComponent(req,res, component, data){
    res.render('components/' + component + '/index.ejs', {...data, utils})
}

module.exports = {
    render,renderComponent
};