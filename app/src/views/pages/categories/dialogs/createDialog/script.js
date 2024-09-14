const dialog = $("#categories-create-dialog")[0]
const closeButton = $("#categories-create-dialog-close-button")
const form =  $("#categories-create-dialog-form")
const categoriesTable = $("#categories-table tbody")


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
        error: function(jqXHR) {
            console.error(jqXHR.responseJSON);
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case "CAT_SRV_CREATE-1":
                    alert('חובה לספק שם')
                    break;
                case "CAT_SRV_CREATE-2":
                    alert('שם קטגוריה כפול')
                    break;
                default:
                    alert('שגיאה לא ידוע ביצירת קטגוריה')
                    break;
            }
        }
    });
})