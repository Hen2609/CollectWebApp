const express = require('express');
const router = express.Router();
const {
    handleGetProducts,
    handleGetProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleProductCard,
} = require('../../controllers/product');

router.get('/all', handleGetProducts);
router.get('/:id', handleGetProduct);
router.post('/', handleCreateProduct);
router.put('/', handleUpdateProduct);
router.delete('/:id', handleDeleteProduct);

router.get('/card/:id', handleProductCard)

module.exports = router;
