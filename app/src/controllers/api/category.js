const categoryService = require('../../services/category');
const CustomError = require('../../utils/customError');

/**
 * Handles the request to retrieve all categories.
 *
 * @param {import("express").Request} req - The request object, containing query parameters.
 * @param {import("express").Response} res - The response object, used to send the response.
 */
const handleGetAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories(req.query.name);
        res.json(categories);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

/**
 * Handles the request to retrieve a category by its ID.
 *
 * @param {import("express").Request} req - The request object, containing route parameters.
 * @param {import("express").Response} res - The response object, used to send the response.
 */
const handleGetCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.json(category);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({error: error.message, code: error.errorCode});
        }
        res.status(500).json({error: error.message});
    }
};

/**
 * Handles the request to create a new category.
 *
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 */
const handleCreateCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body.name);
        return res.status(201).json(category);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({error: error.message, code: error.errorCode});
        }
        res.status(500).json({error: error.message});
    }
};

/**
 * Handles the request to update an existing category.
 *
 * @param {import("express").Request} req - The request object, containing the body data.
 * @param {import("express").Response} res - The response object, used to send the response.
 */
const handleUpdateCategory = async (req, res) => {
    try {
        await categoryService.updateCategory(req.body.id, req.body.name);
        return res.sendStatus(201);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({error: error.message, code: error.errorCode});
        }
        res.status(500).json({error: error.message});
    }
};

/**
 * Handles the request to delete a category by its ID.
 *
 * @param {import("express").Request} req - The request object, containing route parameters.
 * @param {import("express").Response} res - The response object, used to send the response.
 */
const handleDeleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return res.sendStatus(200);
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(400).json({error: error.message, code: error.errorCode});
        }
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    handleGetAllCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
};
