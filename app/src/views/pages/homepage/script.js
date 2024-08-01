const buttons = $(".add-to-cart-button").on("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const ammount = productCard.querySelector('input[type="number"]').value
    const cart = JSON.parse(localStorage.getItem('cart')) ?? {}
    if(!cart[productCard.dataset.productId ]){
        cart[productCard.dataset.productId ] = 0
    }
    cart[productCard.dataset.productId ] += parseFloat(ammount)
    localStorage.setItem('cart',JSON.stringify(cart))
    const event = new CustomEvent("cartChanged")
    document.dispatchEvent(event)
})

const params = new URLSearchParams(window.location.search)
params.getAll("categories").forEach(cat => {
    $('input[value="' + cat +'"]').prop('checked',true)
})
$("#free-search").val(params.get('search'))