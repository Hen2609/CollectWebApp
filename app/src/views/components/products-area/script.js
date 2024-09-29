function initProductsArea(domInit){
    const buttons = $(".add-to-cart-button")
    buttons.on("click", (e) => {
        const productCard = e.target.closest(".product-card");
        const amount = productCard.querySelector('input[type="number"]').value
        const productId = productCard.dataset.productId
        const cart = JSON.parse(localStorage.getItem('cart')) ?? {}
        const productsInCart = parseFloat(amount)
        if(isNaN(productsInCart) || productsInCart <= 0){
            delete cart[productId]
        }else {
            cart[productId] = productsInCart
        }
        localStorage.setItem('cart',JSON.stringify(cart))
        const event = new CustomEvent("cartChanged")
        document.dispatchEvent(event)
        updateButtonText(e.target,productsInCart)
    })

    const increaseButtons = $('.increase-button')
    increaseButtons.on("click", (e) => {
        const productCard = e.target.closest(".product-card");
        const input = productCard.querySelector('input[type="number"]')
        const amount = parseFloat(input.value)
        input.value = isNaN(amount) ? 1 : amount + 1;
    })

    const decreaseButtons = $('.decrease-button')
    decreaseButtons.on("click", (e) => {
        const productCard = e.target.closest(".product-card");
        const input = productCard.querySelector('input[type="number"]')
        const amount = parseFloat(input.value)
        input.value = (isNaN(amount) || amount <= 0 ) ? 0 : amount - 1;
    })

    if(domInit){
        document.addEventListener('DOMContentLoaded',initCardTexts)
    }else {
        initCardTexts()
    }
}

function initCardTexts(){
    const cart = JSON.parse(localStorage.getItem('cart')) ?? {}
    $(".product-card").each((_,card) => {
        const productId = card.dataset.productId
        const $button = $(card).find(".add-to-cart-button");
        const button = $button[0];
        updateButtonText(button,cart[productId])
    })
}
/**
 * Updates the text content of a given button based on the number of products in the cart.
 * @param {HTMLElement | undefined} button - The button element whose text needs to be updated.
 * @param {number} productsInCart - The number of products currently in the cart.
 * @return {void}
 */
function updateButtonText(button, productsInCart){
    if(!button) return;
    if(productsInCart > 0){
        button.textContent = 'עדכן בעגלה'
    }else {
        button.textContent = 'הוסף לעגלה'
    }
}
initProductsArea(true)