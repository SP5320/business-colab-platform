const express = require('express');
const router = express.Router();
const products = require('../controller/products');
// Route to get all locations
router.get('/', products.getProducts);

// Route to get a specific location by ID
router.get('/:id', products.getProduct);

module.exports = router;