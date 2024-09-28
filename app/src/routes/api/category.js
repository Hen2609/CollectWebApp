const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/api/category');
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")

router.get('/all', categoryController.handleGetAllCategories);
router.get('/:id', categoryController.handleGetCategoryById);
router.post('/', userAdminGuard, categoryController.handleCreateCategory);
router.put('/', userAdminGuard, categoryController.handleUpdateCategory);
router.delete('/:id',userAdminGuard, categoryController.handleDeleteCategory);

module.exports = router;