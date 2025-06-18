const pool = require('../supaBase');

// Exporting functions directly as they are declared
module.exports.getLocations = async (req, res) => {
    try {
        // Perform the SELECT query on the 'locations' table
        const result = await pool.query('SELECT * FROM locations');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

module.exports.getLocation = async (req, res) => {
    try {
        const searchValue = req.params.id;

        // Use LOWER() to make the query case-insensitive
        const query = `
            SELECT * 
            FROM locations 
            WHERE CAST(location_id AS TEXT) = $1 
               OR LOWER(country) LIKE LOWER($1)
               OR LOWER(city) LIKE LOWER($1)
               OR LOWER(state) LIKE LOWER($1)
               OR LOWER(zipcode) LIKE LOWER($1)
        `;

        const result = await pool.query(query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No location found' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching location:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};


