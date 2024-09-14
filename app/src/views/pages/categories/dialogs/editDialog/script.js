const dialog = $("#categories-edit-dialog")[0]
const closeButton = $("#categories-edit-dialog-close-button")
const form =  $("#categories-edit-dialog-form")
const categoriesTable = $("#categories-table tbody")


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
        error: function(jqXHR) {
            console.error(jqXHR.responseJSON);
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case "CAT_SRV_UPDATE-1":
                    alert('חובה לספק מזהה קטגוריה')
                    break;
                case "CAT_SRV_UPDATE-2":
                    alert('חובה לספק שם ')
                    break;
                case "CAT_SRV_UPDATE-3":
                    alert('שם תפוס')
                    break;
                case "CAT_SRV_UPDATE-4":
                    alert('קטגוריה לא נמצאה')
                    break;
                default:
                    alert('שגיאה לא ידוע בעדכון קטגוריה')
                    break;
            }
        }
    });
})