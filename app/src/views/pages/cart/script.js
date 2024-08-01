
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


const canvas = $('#signature-pad')[0];
const context = canvas.getContext('2d')
context.lineWidth = 3;
context.lineJoin = context.lineCap = 'round';

let writingMode = false;
function getCursorPosition(event){
    const positionX = event.clientX - event.target.getBoundingClientRect().x;
    const positionY = event.clientY - event.target.getBoundingClientRect().y;
    return [positionX, positionY];
}
function handlePointerDown(event){
    writingMode = true;
    context.beginPath();
    const [positionX, positionY] = getCursorPosition(event);
    context.moveTo(positionX, positionY);
}
function handlePointerUp() {
    writingMode = false;
}
function handlePointerMove(event){
    if (!writingMode) return
    const [positionX, positionY] = getCursorPosition(event);
    context.lineTo(positionX, positionY);
    context.stroke();
}
function getSigantureBase64(){
    return canvas.toDataURL()
}
function clearPad(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}
  
canvas.addEventListener('pointerdown', handlePointerDown, {passive: true});
canvas.addEventListener('pointerup', handlePointerUp, {passive: true});
canvas.addEventListener('pointermove', handlePointerMove, {passive: true});