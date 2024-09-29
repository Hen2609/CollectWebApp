const params = new URLSearchParams(window.location.search)
params.getAll("categories").forEach(cat => {
    $('input[value="' + cat +'"]').prop('checked',true)
})
$("#free-search").val(params.get('search'))
$("#max-price").val(params.get('max-price'))