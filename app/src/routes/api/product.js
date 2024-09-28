const express = require('express');
const router = express.Router();
const {
    handleGetProducts,
    handleGetProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleProductCard,
} = require('../../controllers/api/product');
const {userAdminGuard, userAuthenticatedGuard} = require("../../utils/auth")


router.get('/all', handleGetProducts);
router.get('/:id', handleGetProduct);
router.post('/', userAdminGuard, handleCreateProduct);
router.put('/', userAdminGuard, handleUpdateProduct);
router.delete('/:id', userAdminGuard, handleDeleteProduct);

router.get('/card/:id', handleProductCard)

module.exports = router;
