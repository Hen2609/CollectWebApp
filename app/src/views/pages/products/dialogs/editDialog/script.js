const dialog = $("#products-edit-dialog")[0]
const closeButton = $("#products-edit-dialog-close-button")
const form =  $("#products-edit-dialog-form")
const productsTable = $("#products-table tbody")

console.log(form)

closeButton.on("click", () => {
    dialog.close();
})

form.submit(function(e) {
    e.preventDefault();
    var form = $(this);
    const data = form.serialize()
    $.ajax({
        type: "PUT",
        url: "/api/product",
        data,
        success: function()
        {
            const id = $('#products-edit-dialog-form input[name="id"]')
            const input = $('#products-edit-dialog-form input[name="name"]')
            const name = input.val()
            productsTable.find('tr[data-product-id="' + id.val() +'"] > td').eq(1).text(name);
            input.val('')
            dialog.close();
        },
    });
})