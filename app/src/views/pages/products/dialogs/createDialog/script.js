const dialog = $("#product-dialog")[0]
const closeButton = $("#product-dialog-close-button")
const form =  $("#product-dialog-form")
const productsTable = $("#products-table tbody")

const imageUploadButton = $("#product-dialog-product-image-upload")
const productImage = $("#product-dialog-product-image")
const imagePreview = $("#product-dialog-product-image-preview")

const addCategoryButton = $("#product-dialog-categories-add-category")
const categoriesSearch = $('#product-dialog-category-search');
const categoriesOptions = $("#product-dialog-categories-list")
const categoryChips = $("#product-dialog-categories-chips")

closeButton.on("click", () => {
    dialog.close();
})

imageUploadButton.on("change", (e) => {
    if(!e.target.files[0]) return;
    var reader = new FileReader();
   reader.readAsDataURL(e.target.files[0]);
   reader.onload = function ({target}) {
    const {result: base64} = target
    productImage.val(base64)
    imagePreview.attr("src", base64)
   };
   reader.onerror = function (error) {
     console.error('Error: ', error);
   };
})

addCategoryButton.on("click", () => {
    if(!categoriesSearch.val()) return;
    const categoryName = categoriesSearch.val().trim();
    const selectedCategory = categoriesOptions.find('option').filter((_,option) => {
        return option.value === categoryName
    })?.[0]
    let categoryId = selectedCategory?.dataset?.id
    if(!categoryId){
        $.ajax({
            url: "/api/category",
            type: "POST",
            data: {
                name: categoryName
            },
            success(result){
                categoryId = result._id
            },
            error: function(jqXHR) {
                console.error(jqXHR.responseJSON);
                const error_code = jqXHR.responseJSON.code
                switch(error_code){
                    case "CAT_SRV_CREATE-1":
                        alert('חובה לספק שם ')
                        break;
                    case "CAT_SRV_CREATE-2":
                        alert('שם קטגוריה כפול')
                        break;
                    default:
                        alert('שגיאה לא ידוע ביצירת קטגוריה')
                        break;
                }
            }
        })
    }
    const { button, hiddenInput } = window.createCategoryChip(categoryId, categoryName)
    categoryChips.append(hiddenInput)
    categoryChips.append(button)
    categoriesSearch.val('')
    window.toggleCategoryAvailable(categoryId)
})

categoryChips.on("click", (e) => {
    const button = e.target.closest('.category-remove-button')
    if(!button) return
    const category = $('.' + button.dataset.categoryId)?.[0]
    if(!category) return
    category.remove()
    button.remove()
    toggleCategoryAvailable(button.dataset.categoryId)
})

form.submit(function(e) {
    e.preventDefault(); 
    const method = dialog.dataset.mode === "create" ? "POST" : "PUT"
    var form = $(this);
    $.ajax({
        type: method,
        url: "/api/product",
        data: form.serialize(),
        success: function(data)
        {
            const existingRow = productsTable.find('tr[data-product-id="' + data.id + '"]').eq(0);            const row = productsTable.find("tr").eq(0);
            const newRow = existingRow?.length > 0  ? existingRow : row.clone()
            newRow.find("td").eq(1).text(data.name);
            const categories = data.categories.map(cat => {
                return categoriesOptions.find('option').filter((_,option) => {
                    return option.dataset.id === cat
                })?.[0]?.value
            })
            const paragraphs = categories.map((val,i) => '<p>' + val + (i !== categories.length - 1 ? ',' : '') +'</p>')
            newRow.find("td").eq(2).html(paragraphs); 
            newRow.find("td").eq(3).text(data.description); 
            newRow.find("td").eq(4).text(window.formatters.currency(data.price)); 
            if(data.image){
                newRow.find("td").eq(5).html('<img src="' + data.image + '" alt="' + data.name + '" width="160" />')
            }else {
                newRow.find("td").eq(5).html('')
            }
            if(existingRow?.length <= 0){
                productsTable.append(newRow)
            }
            dialog.close()
        },
        error: function(jqXHR) {
            console.error(jqXHR.responseJSON);
            const error_code = jqXHR.responseJSON.code
            if(method === "POST"){
                switch(error_code){
                    case "PRD_SRV_CREATE-1":
                        alert('חובה לספק שם מוצר')
                        break;
                    case "PRD_SRV_CREATE-2":
                        alert('חובה לספק קטגוריות')
                        break;
                    case "PRD_SRV_CREATE-3":
                        alert('חובה לספק תיאור')
                        break;
                    case "PRD_SRV_CREATE-4":
                        alert('חובה לספק מחיר')
                        break;
                    case "PRD_SRV_CREATE-5":
                        alert('מחיר חייב להיות מספר')
                        break;
                    case "PRD_SRV_CREATE-6":
                        alert('שם מוצר כפול')
                        break;
                    default:
                        alert('שגיאה לא ידועה')
                        break;
                }
            }else {
                switch(error_code){
                    case "PRD_SRV_UPDATE-1":
                        alert('חובה לספק מזהה מוצר')
                        break;
                    case "PRD_SRV_UPDATE-2":
                        alert('חובה לספק שם מוצר')
                        break;
                    case "PRD_SRV_UPDATE-3":
                        alert('חובה לספק קטגוריות')
                        break;
                    case "PRD_SRV_UPDATE-4":
                        alert('חובה לספק תיאור')
                        break;
                    case "PRD_SRV_UPDATE-5":
                        alert('חובה לספק מחיר')
                        break;
                    case "PRD_SRV_UPDATE-6":
                        alert('מחיר חייב להיות מספר')
                        break;
                    case "PRD_SRV_UPDATE-7":
                        alert('שם מוצר כפול')
                        break;
                    default:
                        alert('שגיאה לא ידועה')
                        break;
                }
            }
        }
    });
})