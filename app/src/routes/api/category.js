const express = require('express');
const router = express.Router();
const {
    isCategoryNameAvailable,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories
} = require('../../controllers/category');

router.get('/all', async (req, res) => {
    const categories = await getCategories(req.query.name)
    res.json(categories)
});
router.get('/:id', async (req, res) => {
    if(!req.params.id){
        return res.status(400).json({error: "must supply category id", code: 1})
    }
    const category = await getCategory(req.params.id)
    if (!category) {
        return res.status(404).json({ error: "Category not found", code: 2 });
    }
    return res.json(category)
});
router.post('/', async (req, res) => {
    if(!req.body.name){
        return res.status(400).json({error: "Must supply name", code: 1})
    }
    const valid_name = await isCategoryNameAvailable(req.body.name)
    if(!valid_name){
        return res.status(400).json({error: "duplicate categroy name", code: 3}``)
    }
    const category = await createCategory(req.body.name)
    return res.status(201).json(category);
});
router.put('/', async (req,res) => {
    if(!req.body.id){
        return res.status(400).json({error: "must supply id", code: 1})
    }
    if(!req.body.name){
        return res.status(400).json({error: "Must supply name", code: 2})
    }
    const nameAvailable = await isCategoryNameAvailable(req.body.name, req.body.id)
    if(!nameAvailable){
        return res.status(400).json({error: "duplicate categroy name", code: 3})
    }

    const updated = await updateCategory(req.body.id, req.body.name.trim());

    if (!updated) {
        return res.status(404).json({ error: "Category not found", code: 4 });
    }
    return res.sendStatus(201)
});
router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Must supply category id", code: 1 });
    }
    const deleted = await deleteCategory(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: "Category not found", code: 2 });
    }

    return res.sendStatus(200);
});

module.exports = router;
