const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category');

router.get('/all', categoryController.handleGetAllCategories);
router.get('/:id', categoryController.handleGetCategoryById);
router.post('/', categoryController.handleCreateCategory);
router.put('/', categoryController.handleUpdateCategory);
router.delete('/:id', categoryController.handleDeleteCategory);

module.exports = router;
