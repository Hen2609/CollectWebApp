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
            }
        })
    }
    const { button, hiddenInput } = window.createCategoryChip(categoryId, categoryName)
    // const hiddenInput = $('<input>').attr({
    //     type: "hidden",
    //     name: "categories",
    //     class: categoryId,
    //     value: categoryId
    // })
    // const buttonContent = $('<span>').html(categoryName.concat(' ','<span class="material-symbols-outlined">close</span>')) 
    // const button = $('<button>').attr({
    //     'data-category-id': categoryId,
    //     class: "category-remove-button",
    //     type: "button"
    // })
    // .append(buttonContent)
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
            const row = productsTable.find("tr").eq(0);
            const newRow = row.clone()
            newRow.attr("data-product-id", data._id);
            newRow.find("td").eq(1).text(data.name); 
            const categories = data.categories.map(cat => {
                return categoriesOptions.find('option').filter((_,option) => {
                    return option.dataset.id === cat
                })?.[0]?.value
            })
            console.log(categories)
            const paragraphs = categories.map((val,i) => '<p>' + val + (i !== categories.length - 1 ? ',' : '') +'</p>')
            console.log(paragraphs)
            newRow.find("td").eq(2).html(paragraphs); 
            newRow.find("td").eq(3).text(data.description); 
            newRow.find("td").eq(4).text(window.formatters.currency(data.price)); 
            if(data.image){
                newRow.find("td").eq(5).html('<img src="' + data.image + '" alt="' + data.name + '" width="160" />')
            }else {
                newRow.find("td").eq(5).html('')
            }
            productsTable.append(newRow)
            dialog.close()
        },
    });
})