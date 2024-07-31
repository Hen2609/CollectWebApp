const dialog = $("#products-create-dialog")[0]
const closeButton = $("#products-create-dialog-close-button")
const form =  $("#products-create-dialog-form")
const productsTable = $("#products-table tbody")

const imageUploadButton = $("#product-create-dialog-product-image-upload")
const productImage = $("#product-create-dialog-product-image")
const imagePreview = $("#product-create-dialog-product-image-preview")

const addCategoryButton = $("#products-create-dialog-categories-add-category")
const categoriesSearch = $('#product-create-dialog-category-search');
const categoriesOptions = $("#products-create-dialog-categories-list")
const categoryChips = $("#products-create-dialog-categories-chips")



const toggleCategoryAvailable = (category_id) => {
    const option = categoriesOptions.find('option').filter((_,option) => {
        return option.dataset.id === category_id
    })?.[0]
    if(!option) return
    if(option.getAttribute('disabled')){
        option.removeAttribute('disabled',disabled)
    }else {
        option.setAttribute('disabled')
    }
}

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
    const hiddenInput = $('<input>').attr({
        type: "hidden",
        name: "categories",
        class: categoryId,
        value: categoryId
    })
    const buttonContent = $('<span>').html(categoryName.concat(' ','<span class="material-symbols-outlined">close</span>')) 
    const button = $('<button>').attr({
        'data-category-id': categoryId,
        class: "category-remove-button",
        type: "button"
    })
    .append(buttonContent)
    categoryChips.append(hiddenInput)
    categoryChips.append(button)
    categoriesSearch.val('')
    toggleCategoryAvailable(categoryId)
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