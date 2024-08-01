const express = require('express');
const { ObjectId } = require('mongodb');
const {renderComponent} = require("../../util/render")
const router = express.Router();
const {
    isProductNameAvailable,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts
} = require('../../controllers/product');
router.get('/card/:id', async(req, res) => {
    if(!req.params.id){
        return res.status(400).json({error: "must supply product id", code: 1})
    }
    const product = await getProduct(req.params.id)
    if (!product) {
        return res.status(404).json({ error: "Product not found", code: 2 });
    }
    renderComponent(req,res,'product-card', {product, addButtonText: "עדכן עגלה"})
})

router.get('/all', async (req, res) => {
    const name = req.query?.name?.replaceAll(/^"|"$/g,'')
    let categories = []
    if(req.query.categories){
        if(Array.isArray(req.query.categories)){
            categories = req.query.categories
        }else {
            categories.push(req.query.categories)
        }
    }
    categories = categories.map(cat => {
        return ObjectId.createFromHexString(cat.replaceAll(/^"|"$/g,''))
    })
    const products = await getProducts(name,categories.length > 0 ? categories : undefined)
    res.json(products)
});
router.get('/:id', async (req, res) => {
    if(!req.params.id){
        return res.status(400).json({error: "must supply product id", code: 1})
    }
    const product = await getProduct(req.params.id)
    if (!product) {
        return res.status(404).json({ error: "Product not found", code: 2 });
    }
    return res.json(product)
});
router.post('/', async (req, res) => {
    if(!req.body.name){
        return res.status(400).json({error: "Must supply name", code: 1})
    }
    if(!req.body.categories){
        return res.status(400).json({error: "Must supply categories", code: 2})
    }
    if(!req.body.description){
        return res.status(400).json({error: "Must supply descruption", code: 3})
    }
    if(!req.body.price){
        return res.status(400).json({error: "Must supply price", code: 4})
    }
    const price = parseFloat(req.body.price)
    if(isNaN(price)){
        return res.status(400).json({error: "Price must be a number", code: 5})
    }
    const valid_name = await isProductNameAvailable(req.body.name)
    if(!valid_name){
        return res.status(400).json({error: "duplicate product name", code: 6})
    }
    const product = await createProduct(req.body.name.trim(),req.body.categories,req.body.description,price,req.body.image)
    return res.status(201).json(product);
});
router.put('/', async (req,res) => {
    if(!req.body.id){
        return res.status(400).json({error: "must supply id", code: 1})
    }
    if(!req.body.name){
        return res.status(400).json({error: "Must supply name", code: 2})
    }
    if(!req.body.categories){
        return res.status(400).json({error: "Must supply categories", code: 3})
    }
    if(!req.body.description){
        return res.status(400).json({error: "Must supply descruption", code: 4})
    }
    if(!req.body.price){
        return res.status(400).json({error: "Must supply price", code: 5})
    }
    const price = parseFloat(req.body.price)
    if(isNaN(price)){
        return res.status(400).json({error: "Price must be a number", code: 6})
    }
    const nameAvailable = await isProductNameAvailable(req.body.name, req.body.id)
    if(!nameAvailable){
        return res.status(400).json({error: "duplicate product name", code: 7})
    }

    const updated = await updateProduct(req.body.id, req.body.name.trim(),req.body.categories,req.body.description,price,req.body.image);

    if (!updated) {
        return res.status(404).json({ error: "Product not found", code: 8 });
    }
    return res.sendStatus(201)
});
router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Must supply product id", code: 1 });
    }
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "Product not found", code: 2 });
    }

    return res.sendStatus(200);
});

module.exports = router;
