const dialog = $("#categories-create-dialog")[0]
const closeButton = $("#categories-create-dialog-close-button")
const form =  $("#categories-create-dialog-form")
const categoriesTable = $("#categories-table tbody")

console.log(form)

closeButton.on("click", () => {
    dialog.close();
})

form.submit(function(e) {
    e.preventDefault();
    var form = $(this);
    $.ajax({
        type: "POST",
        url: "/api/category",
        data: form.serialize(),
        success: function(data)
        {
            const row = categoriesTable.find("tr").eq(0);
            const newRow = row.clone()
            newRow.attr("data-category-id", data._id);
            newRow.find("td").eq(1).text(data.name); 
            categoriesTable.append(newRow)
            dialog.close()
        },
    });
})