const mongoose = require('mongoose');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../services/product');
const CustomError = require('../utils/customError');
const {renderComponent} = require("../utils/render");

/**
 * Get all products
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetProducts(req, res) {
    try {
        const { name, categories } = req.query;
        const categoryArray = categories ? categories.split(',').map(id => mongoose.Types.ObjectId.createFromHexString(id)) : undefined;
        const products = await getProducts(name, categoryArray);
        res.status(200).json(products);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({ message: error.message, code: error.errorCode });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * Get a single product by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetProduct(req, res) {
    try {
        const product = await getProduct(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({ message: error.message, code: error.errorCode });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * Create a new product
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function handleCreateProduct(req, res) {
    try {
        const { name, categories, description, price, image } = req.body;
        const categoryArray = categories ? categories.map(id => mongoose.Types.ObjectId(id)) : [];
        const product = await createProduct(name, categoryArray, description, price, image);
        res.status(201).json(product);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({ message: error.message, code: error.errorCode });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * Update a product by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function handleUpdateProduct(req, res) {
    try {
        const { name, categories, description, price, image } = req.body;
        const categoryArray = categories ? categories.map(id => mongoose.Types.ObjectId(id)) : [];
        const isUpdated = await updateProduct(req.params.id, name, categoryArray, description, price, image);

        if (isUpdated) {
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({ message: error.message, code: error.errorCode });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * Delete a product by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
async function handleDeleteProduct(req, res) {
    try {
        const isDeleted = await deleteProduct(req.params.id);

        if (isDeleted) {
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(400).json({ message: error.message, code: error.errorCode });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

/**
 * Handles the request for a product card by fetching the product details and rendering the product card component.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @return {Promise<void>} - A promise that resolves with no value once the request is fully handled.
 */
async function handleProductCard(req, res) {
    if(!req.params.id){
        res.status(400).json({error: "must supply product id", code: 1})
    }
    const product = await getProduct(req.params.id)
    if (!product) {
        res.status(404).json({ error: "Product not found", code: 2 });
    }
    renderComponent(req,res,'product-card', {product, addButtonText: "עדכן עגלה"})
}

module.exports = {
    handleGetProducts,
    handleGetProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleProductCard,
};