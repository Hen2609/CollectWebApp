
async function initCartItem(productId, quantity){
    const req = await fetch('/api/product/card/' + productId, {credentials: "include"})
    const html = await req.text()
    const updatedHtml = html.replace(/(<input[^>]*\bvalue=")[^"]*(".*?>)/i, `$1${quantity}$2`);
    return updatedHtml
}

async function initPage(){
    const cart = JSON.parse(window.localStorage.getItem("cart"))
    const product_cards  = Object.entries(cart).map(async (entry) => {
        const [productId, quantity] = entry;
        return initCartItem(productId,quantity)
    })
    const cards = await Promise.all(product_cards)
    console.log('cards',cards)
    const cartItems = $("#cart-items")
    console.log('cartItems',cartItems)
    cartItems.html(cards.join(' '))
}

window.addEventListener('DOMContentLoaded', () => {
    initPage()
})