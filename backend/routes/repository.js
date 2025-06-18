const express = require('express');
const router = express.Router();
const products = require('../controller/repository');
// Route to get all locations
router.get('/', products.getRepository);

// Route to get a specific repository by ID
router.get('/:id', products.getRepositories);

// This route handles the search query
router.get('/search', products.searchRepository);
module.exports = router;