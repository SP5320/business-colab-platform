const express = require('express');
const router = express.Router();
const products = require('../controller/search');
const authenticateToken = require('../middleware/auth');

// Protected Routes (require authentication)
router.get('/product/:id', authenticateToken, products.getSearchByProduct); // Main API
router.get('/repository/:id', authenticateToken, products.getSearchByRepository); // Main API
router.get('/:id', authenticateToken, products.getSearch); // Main API

// Temporary Routes (no authentication)
router.get('/temp/search/:id', products.getSearch); // General search
router.get('/temp/product/:id', products.getSearchByProduct); // Product-specific search
router.get('/temp/repository/:id', products.getSearchByRepository); // Repository-specific search

module.exports = router;
