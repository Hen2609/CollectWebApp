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
    if($(e.target).closest('button.delete-button').length > 0){
        if(confirm("האם אתה בטוח שאתה רוצה למחוק את הקטגוריה?")){
            $.ajax({
                type: "DELETE",
                url: "/api/category/" + row.dataset.categoryId,
                success: function()
                {
                    row.remove()
                },
            });
        }
    }
    else if($(e.target).closest('button.edit-button').length > 0){
        $('#categories-edit-dialog-form input[name="id"]').val(row.dataset.categoryId)
        $('#categories-edit-dialog-form input[name="name"]').val(name.textContent)
        editDialog.showModal()
    }
})