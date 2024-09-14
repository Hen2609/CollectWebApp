const {getProductsOfOrder} = require("../services/order")
const ejs = require("ejs")

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_KEY });

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
    const template = `
    <div dir="rtl">
        <h1 style="color: #2c3e50; border-block-end: 2px solid #3498db; padding-block-end: 10px;">נוצרה הזמנה חדשה</h1>
        <table style="width: fit-content; border-collapse: collapse; margin-bottom: 20px;"">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">משתמש</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">תאריך</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">סכום</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= order.user ?? "רכישה אנונימית" %></td>
                    <% const date = new Date(order.date).toLocaleDateString('he-IL'); %>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= date %></td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= order.price %></td>
                </tr>
            </tbody>
        </table>
        <h2 style="color: #2c3e50; border-block-end: 2px solid #3498db; padding-block-end: 10px;">מוצרים</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;"">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">שם</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">תיאור</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">כמות יחידות</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: right; background-color: #3498db; color: white;">מחיר ליחידה</th>
                </tr>
            </thead>
            <tbody>
                <% products.forEach(product => { %>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= product.name %></td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= product.description %></td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= order.products.find(p => p.id.toString() === product._id.toString())?.quantity %></td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;"><%= product.price %></td>
                    </tr>
                <% }) %>
            </tbody>
        </table>
    </div>
    `;
    const products = await getProductsOfOrder(order._id)
    const email_content = ejs.render(template, {order, products});
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