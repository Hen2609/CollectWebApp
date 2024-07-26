const dialog = $("#categories-edit-dialog")[0]
const closeButton = $("#categories-edit-dialog-close-button")
const form =  $("#categories-edit-dialog-form")
const categoriesTable = $("#categories-table tbody")

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
        url: "/api/category",
        data,
        success: function()
        {
            const id = $('#categories-edit-dialog-form input[name="id"]')
            const input = $('#categories-edit-dialog-form input[name="name"]')
            const name = input.val()
            categoriesTable.find('tr[data-category-id="' + id.val() +'"] > td').eq(1).text(name);
            input.val('')
            dialog.close();
        },
    });
})