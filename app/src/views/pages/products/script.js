const createDialog = $("#products-create-dialog")[0]
const editDialog = $("#products-edit-dialog")[0]
const openCreateDialogButton = $("#products-create-dialog-open-button")
const productsTable = $("#products-table tbody")

openCreateDialogButton.on("click", () => {
    createDialog.showModal();
})

productsTable.on("click", (e) => {
    const row = $(e.target).closest('tr')?.[0]
    const name = row.querySelector("td:nth-child(2)")
    if(!row){
        return
    }
    if($(e.target).closest('button.delete-button').length > 0){
        if(confirm("האם אתה בטוח שאתה רוצה למחוק את המוצר?")){
            $.ajax({
                type: "DELETE",
                url: "/api/product/" + row.dataset.productId,
                success: function()
                {
                    row.remove()
                },
            });
        }
    }
    else if($(e.target).closest('button.edit-button').length > 0){
        $('#products-edit-dialog-form input[name="id"]').val(row.dataset.productId)
        $('#products-edit-dialog-form input[name="name"]').val(name.textContent)
        editDialog.showModal()
    }
})