const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const verifyToken = require('../middleware/verifyToken');


// POST /categories - Create a new category
router.post('/category',verifyToken, categoryController.createCategory);

// PUT /categories/:id - Update a category
router.put('/category/:id',verifyToken, categoryController.updateCategory);

// GET /categories - Get all categories
router.get('/category',verifyToken, categoryController.getAllCategories);

// GET /categories/:id - Get a single category
router.get('/category/:id',verifyToken, categoryController.getCategoryById);

// DELETE /categories/:id - Delete a category
router.delete('category/:id',verifyToken, categoryController.deleteCategory);

module.exports = router;
