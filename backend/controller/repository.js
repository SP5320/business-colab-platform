const pool = require('../supaBase');

// Exporting functions directly as they are declared
module.exports.getRepositories = async (req, res) => {
    try {
        // Perform the SELECT query on the 'locations' table
        const result = await pool.query('SELECT * FROM repositories');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

module.exports.getRepository = async (req, res) => {
    try {
        const searchValue = req.params.id;
        const query = `
                        SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.title, 
                employees.phone, 
                employees.email_id, 
                employees.description, 
                employees.is_team_lead, 
                employees.is_poc,
                teams.team_id, 
                teams.team_name, 
                teams.team_desc,
                locations.location_id, 
                locations.country, 
                locations.state, 
                locations.city, 
                locations.zipcode,
                repositories.repository_id, 
                repositories.repository_name, 
                repositories.created_date,
                products.product_id, 
                products.product_name, 
                products.description AS product_description
            FROM 
                employees
            JOIN 
                repositories ON employees.employee_id = repositories.poc_emp_id
            JOIN 
                teams ON employees.team_id = teams.team_id
            JOIN 
                locations ON employees.location_id = locations.location_id
            JOIN 
                products ON repositories.product_id = products.product_id
            where repositories.repository_id LIKE '$1%';
        `;

        const result = await pool.query(query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No respository found' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching location:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

module.exports.searchRepository = async (req, res) => {
    try {
        const searchValue = req.query.query;

        // SQL query to search for matching values in location_id, city, state, country, or zipcode
        const query = `
                        SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.title, 
                employees.phone, 
                employees.email_id, 
                employees.description, 
                employees.is_team_lead, 
                employees.is_poc,
                teams.team_id, 
                teams.team_name, 
                teams.team_desc,
                locations.location_id, 
                locations.country, 
                locations.state, 
                locations.city, 
                locations.zipcode,
                repositories.repository_id, 
                repositories.repository_name, 
                repositories.created_date,
                products.product_id, 
                products.product_name, 
                products.description AS product_description
            FROM 
                employees
            JOIN 
                repositories ON employees.employee_id = repositories.poc_emp_id
            JOIN 
                teams ON employees.team_id = teams.team_id
            JOIN 
                locations ON employees.location_id = locations.location_id
            JOIN 
                products ON repositories.product_id = products.product_id
            where repositories.repository_id LIKE '$1';
        `;

        // Use wildcard '%' for partial matching
        const result = await pool.query(query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No Repository found' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

