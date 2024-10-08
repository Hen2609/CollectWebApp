const createDialog = $("#categories-create-dialog")[0]
const editDialog = $("#categories-edit-dialog")[0]
const openCreateDialogButton = $("#categories-create-dialog-open-button")
const categoriesTable = $("#categories-table tbody")

openCreateDialogButton.on("click", () => {
    createDialog.showModal();
})

categoriesTable.on("click", (e) => {
    const row = $(e.target).closest('tr')?.[0]
    const name = row.querySelector("td:nth-child(2)")
    if(!row){
        return
    }
    if($(e.target).closest('#delete-button').length > 0){
        if(confirm("האם אתה בטוח שאתה רוצה למחוק את הקטגוריה?")){
            $.ajax({
                type: "DELETE",
                url: "/api/category/" + row.dataset.categoryId,
                success: function()
                {
                    row.remove()
                },
                error: function(jqXHR) {
                    console.error(jqXHR.responseJSON);
                    const error_code = jqXHR.responseJSON.code
                    switch (error_code){
                        case "CAT_SRV_DELETE-1":
                            alert("חובה לספק מזהה קטגוריה")
                            break;
                        default:
                            alert('שגיאה לא ידועה במחיקת קטגוריה')
                            break;
                    }
                }
            });
        }
    }
    else if($(e.target).closest('#edit-button').length > 0){
        $('#categories-edit-dialog-form input[name="id"]').val(row.dataset.categoryId)
        $('#categories-edit-dialog-form input[name="name"]').val(name.textContent)
        editDialog.showModal()
    }
})