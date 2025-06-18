const pool = require('../supaBase');

// Exporting functions directly as they are declared
module.exports.getProducts = async (req, res) => {
    try {
        // Perform the SELECT query on the 'locations' table
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

module.exports.getProduct = async (req, res) => {
    try {
        const searchValue = req.params.id;

        // Use LOWER() to make the query case-insensitive
        const query = `
            SELECT * 
            FROM products 
            WHERE LOWER(product_name) LIKE LOWER($1)
        `;

        const result = await pool.query(query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No product found' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

