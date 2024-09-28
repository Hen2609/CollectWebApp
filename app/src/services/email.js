const ejs = require("ejs")
const formatters = require("../utils/formatters")
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_KEY });
const fs = require("fs");
const path = require("path");
const {getProductsOfOrder} = require("./order");
/**
 * @fileoverview This file defines the getProducts function.
 * @requires ../models/product
 * @typedef {import('../models/order').Order} Order
 */


/**
 * Sends an email notification for an order that has been created.
 * @async
 * @function sendOrderCreatedEmail
 * @param {Order} order
 * @return {Promise<Object>} - A promise that resolves to the response from the email sending service.
 */
async function sendOrderCreatedEmail(order){
    const emailTemplate = `
    <div dir="rtl">
        <h1 style="color: #2c3e50; border-block-end: 2px solid #3498db; padding-block-end: 10px;">נוצרה הזמנה חדשה</h1>
        <table style="width: fit-content; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
        <tr>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">משתמש</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">תאריך</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">סכום</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= order.user ? order.user : "רכישה אנונימית" %></td>
            <% const date = new Date(order.date).toLocaleDateString('he-IL'); %>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= date %></td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= utils.formatters.currency(order.price)%></td>
        </tr>
        </tbody>
        </table>
        <h2 style="color: #2c3e50; border-block-end: 2px solid #3498db; padding-block-end: 10px;">מוצרים</h2>
        <%- products %>
    </div>
`
    const utils = {
        formatters
    }
    const productTemplatePath = path.resolve(__dirname,"../views/components/order-products/index.ejs")
    const productTemplate = fs.readFileSync(path.resolve(productTemplatePath)).toString()
    const products = await getProductsOfOrder(order._id)
    products.forEach(product => {
        product["quantity"] = order.products.find(op => op.id.equals(product._id))?.quantity
    })
    const productsTable = ejs.render(productTemplate, {products, utils})
    const email_content = ejs.render(emailTemplate, {order, products: productsTable, utils});
    return mg.messages.create('sandboxeded159a31d94b54b535b948df6548b3.mailgun.org', {
        from: "Kodesh Store <mailgun@sandboxeded159a31d94b54b535b948df6548b3.mailgun.org>",
        to: [process.env.MAILGUN_RECIPIENT],
        subject: "הזמנה חדשה נוצרה".concat(" ", order.date.toLocaleString("he-IL")),
        html:email_content,
    })
}

module.exports = {
    sendOrderCreatedEmail
}