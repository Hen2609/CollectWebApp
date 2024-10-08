const createDialog = $("#product-dialog")[0]
const editDialog = $("#products-edit-dialog")[0]
const openCreateDialogButton = $("#product-dialog-open-button")
const productsTable = $("#products-table tbody")
const categoriesOptions = $("#product-dialog-categories-list")
const categoryChips = $("#product-dialog-categories-chips")

openCreateDialogButton.on("click", () => {
    createDialog.setAttribute('data-mode','create')
    $('#product-dialog-form input[name="id"]').val('')
    $('#product-dialog-form input[name="name"]').val('')
    $('#product-dialog-form textarea[name="description"]').val('')
    $('#product-dialog-form input[name="price"]').val('')
    $('#product-dialog-form input[name="image"]').val('')
    $('#product-dialog-form img').attr({src: ''})
    categoryChips.empty()
    createDialog.showModal();
})

productsTable.on("click", (e) => {
    const row = $(e.target).closest('tr')?.[0]
    if(!row){
        return
    }
    if($(e.target).closest('#delete-button').length > 0){
        if(confirm("האם אתה בטוח שאתה רוצה למחוק את המוצר?")){
            $.ajax({
                type: "DELETE",
                url: "/api/product/" + row.dataset.productId,
                success: function()
                {
                    row.remove()
                },
                error: function(jqXHR) {
                    console.error(jqXHR.responseJSON);
                    const error_code = jqXHR.responseJSON.code
                    switch (error_code){
                        case "PRD_SRV_DELETE-1":
                            alert("חובה לספק מזהה מוצר")
                            break;
                        default:
                            alert('שגיאה לא ידועה')
                            break;
                    }
                }
            });
        }
    }
    else if($(e.target).closest('#edit-button').length > 0){
        const name = row.querySelector("td:nth-child(2)")?.textContent
        const description = row.querySelector("td:nth-child(4)")?.textContent
        const price_string = row.querySelector("td:nth-child(5)")?.textContent.match(/\d+\.?\d*/)
        const price = price_string ? parseFloat(price_string) : 0
        const image = row.querySelector("img")?.getAttribute("src")
        const product_categories = Array.from(row.querySelectorAll("p")).map((cat) => {
            return cat.textContent.split(",")[0]
        })
        const all_categories = categoriesOptions.find('option').filter((_,opt) => product_categories.includes(opt.value))
        .map((_,opt) => ({id: opt.dataset.id, name: opt.value})).get()


        createDialog.setAttribute('data-mode','edit')
        createDialog.querySelector("#submit-button").textContent = 'עדכן מוצר'
        $('#product-dialog-form input[name="id"]').val(row.dataset.productId)
        $('#product-dialog-form input[name="name"]').val(name)
        $('#product-dialog-form textarea[name="description"]').val(description)
        $('#product-dialog-form input[name="price"]').val(price)
        $('#product-dialog-form input[name="image"]').val(image)
        $('#product-dialog-form img').attr({src: image})
        categoryChips.empty()
        all_categories.forEach(cat => {
            const { button, hiddenInput } = window.createCategoryChip(cat.id, cat.name)
            categoryChips.append(hiddenInput)
            categoryChips.append(button)
            window.toggleCategoryAvailable(cat.id)
        })

        createDialog.showModal()
    }
})