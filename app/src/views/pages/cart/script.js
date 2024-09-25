
async function initCartItem(productId, quantity){
    const req = await fetch('/api/product/card/' + productId, {credentials: "include"})
    const html = await req.text()
    return html.replace(/(<input[^>]*\bvalue=")[^"]*(".*?>)/i, `$1${quantity}$2`)
}

async function initPage(){
    const cart = JSON.parse(window.localStorage.getItem("cart"))
    const product_cards  = Object.entries(cart).map(async (entry,i) => {
        const [productId, quantity] = entry;
        const hiddenIdInput = $('<input>').attr({
            type: 'hidden',
            name: `products[${i}][id]`,
            value: productId
        });
        const hiddenQuantityInput = $('<input>').attr({
            type: 'hidden',
            name: `products[${i}][quantity]`,
            value: quantity
        });
        const header = $("#cart-header")
        header.append(hiddenIdInput)
        header.append(hiddenQuantityInput)
        return initCartItem(productId,quantity)
    })
    const cards = await Promise.all(product_cards)
    const cartItems = $("#cart-items")
    cartItems.html(cards.join(' '))
    cartChanged()
}
document.addEventListener("cartChanged", () => {
    cartChanged()
});
function cartChanged(){
    const sum = calculateCartPrice()
    toggleConfirm(sum > 0)
}

function calculateCartPrice(){
    let sum = 0;
    $('.product-card').each(function() {
        const value = parseFloat($(this).find('data[aria-label="מחיר"]').val())
        const amount = parseFloat($(this).find('input').val())
        if(isNaN(amount) || amount === 0){
            $(this).remove()
        }else if(!isNaN(value)){
            sum += value * amount
        }
    })
    const cartPrice = $("#cart-pice")
    cartPrice.attr('value',sum)
    cartPrice.html(window.formatters.currency(sum))
    $('input[name="price"]').val(sum)
    return sum
}

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
function getSignatureBase64(){
    return canvas.toDataURL()
}
function clearPad(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    toggleConfirm();
}
function updateSignatureInput(){
    $('input[name="signature"]').val(getSignatureBase64())
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
            console.error(jqXHR.responseJSON);
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case "ORD_SRV_CREATE-1":
                    alert('לא סופקו מוצרים')
                    break;
                case "ORD_SRV_CREATE-2":
                    alert('לא סופק מחיר')
                    break;
                case "ORD_SRV_CREATE-3":
                    alert('לא סופקה חתימה')
                    break;
                case "ORD_SRV_CREATE-4":
                    alert('לא סופק תאריך הזמנה')
                    break;
                case "ORD_SRV_CREATE-5":
                    alert('מחיר חייב להיות ערך מספרי')
                    break;
                default:
                    alert('שגיאה לא ידועה ביצירת הזמנה')
                    break;
            }
        }
    })
    return false;
})