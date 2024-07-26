const dialog = $("#products-create-dialog")[0]
const closeButton = $("#products-create-dialog-close-button")
const form =  $("#products-create-dialog-form")
const productsTable = $("#products-table tbody")

console.log(form)

closeButton.on("click", () => {
    dialog.close();
})

form.submit(function(e) {
    e.preventDefault();
    var form = $(this);
    $.ajax({
        type: "POST",
        url: "/api/product",
        data: form.serialize(),
        success: function(data)
        {
            const row = productsTable.find("tr").eq(0);
            const newRow = row.clone()
            newRow.attr("data-product-id", data._id);
            newRow.find("td").eq(1).text(data.name); 
            productsTable.append(newRow)
            dialog.close()
        },
    });
})