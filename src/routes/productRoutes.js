// routes/product.routes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const verifyToken = require('../middleware/verifyToken');
// POST /products - Create a new product
router.post('/products',verifyToken, productController.createProduct);

// PUT /products/:id - Update a product
router.put('/products/:id',verifyToken, productController.updateProduct);

// GET /products - Get all products
router.get('/products',verifyToken, productController.getAllProducts);

// GET /products/:id - Get a single product
router.get('/products/:id',verifyToken, productController.getProductById);

// DELETE /products/:id - Delete a product
router.delete('/products/:id',verifyToken, productController.deleteProduct);

module.exports = router;
