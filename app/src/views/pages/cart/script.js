
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
        const hiddenInput = $('<input>').attr({
            type: 'hidden',
            name: 'products',
            value: productId
        });
        $("#cart-header").append(hiddenInput)
        return initCartItem(productId,quantity)
    })
    const cards = await Promise.all(product_cards)
    const cartItems = $("#cart-items")
    cartItems.html(cards.join(' '))
    calculateCartPrice()
    toggleConfirm();
    $(".add-to-cart-button").on('click', (e) => {
        const productCard = e.target.closest(".product-card");
        const ammount = productCard.querySelector('input[type="number"]').value
        const cart = JSON.parse(localStorage.getItem('cart')) ?? {}
        if(!cart[productCard.dataset.productId ]){
            cart[productCard.dataset.productId ] = 0
        }
        cart[productCard.dataset.productId ] = parseFloat(ammount)
        if(cart[productCard.dataset.productId] <= 0){
            delete cart[productCard.dataset.productId];
            productCard.remove()
        }
        localStorage.setItem('cart',JSON.stringify(cart))
        const event = new CustomEvent("cartChanged")
        document.dispatchEvent(event)
        calculateCartPrice() 
    })
}
function calculateCartPrice(){
    let sum = 0;
    $('.product-card').each(function() {
        const value = parseFloat($(this).find('data[aria-label="מחיר"').val())
        const ammount = parseFloat($(this).find('input').val())
        if(!isNaN(value) && !isNaN(ammount)){
            sum += value * ammount
        }
    })
    const cartPrice = $("#cart-pice")
    cartPrice.attr('value',sum)
    cartPrice.html(window.formatters.currency(sum))
    $('input[name="price"]').val(sum)
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
    toggleConfirm(true)
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
    toggleConfirm();
}
function updateSignatureInput(){
    $('input[name="signature"]').val(getSigantureBase64())
}

function toggleConfirm(enable){
    if(enable){
        $("#cart-approve-order-button").attr('disabled',false)
    }else {
        $("#cart-approve-order-button").attr('disabled',true)
    }
    updateSignatureInput()
}

canvas.addEventListener('pointerdown', handlePointerDown, {passive: true});
canvas.addEventListener('pointerup', handlePointerUp, {passive: true});
canvas.addEventListener('pointermove', handlePointerMove, {passive: true});
$("#clear-pad").on('click', clearPad)

$('#cart-header').submit(function() {
    $.ajax({
        type: "POST",
        url: "/api/order",
        data: $(this).serialize(),
        success: function(){
            localStorage.setItem('cart',JSON.stringify({}))
            window.location.href = "/"
        },
        error: function(jqXHR) {
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case 1:
                    alert('לא סופקו מוצרים')
                    break;
                case 2:
                    alert('לא סופק מחיר')
                    break;
                case 3:
                    alert('לא סופקה חתימה')
                    break;
                case 4:
                    alert('לא סופק תאריך הזמנה')
                    break;
                case 5:
                    alert('מחיר חייב להיות ערך מספרי')
                    break;
                default:
                    alert('שגיאה לא ידוע בהרשמה')
                    break;
            }
        }
    })
    return false;
})