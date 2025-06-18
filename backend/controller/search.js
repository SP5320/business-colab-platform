const pool = require('../supaBase');
module.exports.getSearch = async (req, res) => {
    try {
        const searchValue = req.params.id;
        // Use LOWER() to make the query case-insensitive
        const query = `
            SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.chat_username,
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
        FROM products
        JOIN repositories ON products.product_id = repositories.product_id
        JOIN employees ON repositories.poc_emp_id = employees.employee_id
        JOIN locations ON employees.location_id = locations.location_id
        JOIN teams ON teams.team_id=employees.team_id
        WHERE LOWER(product_name) LIKE LOWER($1)
        UNION
            SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.chat_username,
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
            JOIN repositories ON employees.employee_id = repositories.poc_emp_id
            JOIN teams ON employees.team_id = teams.team_id
            JOIN locations ON employees.location_id = locations.location_id
            JOIN products ON repositories.product_id = products.product_id where lower(repository_name) LIKE lower($1) ;
        `;

        const result = await pool.query(query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No repository or product found' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error fetching repository or product:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};


module.exports.getSearchByProduct = async (req, res) => {
    try {
        const searchValue = req.params.id;

        // Use LOWER() to make the query case-insensitive
        const query = `
            SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.chat_username, 
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
        FROM products
        JOIN repositories ON products.product_id = repositories.product_id
        JOIN employees ON repositories.poc_emp_id = employees.employee_id
        JOIN locations ON employees.location_id = locations.location_id
        JOIN teams ON teams.team_id=employees.team_id
        WHERE LOWER(product_name) LIKE LOWER($1)
            `;
        const
            result = await pool.query
                (query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No product found' });
        } else {
            res.status(200).json({ "Product details": result.rows, "message: ": "Product found" });
        }
    }
    catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

module.exports.getSearchByRepository = async (req, res) => {
    try {
        const searchValue = req.params.id;

        // Use LOWER() to make the query case-insensitive
        const query = `
            SELECT 
                employees.employee_id, 
                employees.first_name, 
                employees.last_name, 
                employees.chat_username,
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
            WHERE LOWER(repository_name) LIKE LOWER($1)
            `;
        const
            result = await pool.query
                (query, [`%${searchValue}%`]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No repository found' });
        } else {
            res.status(200).json({ "Repository details": result.rows, "message: ": "Repository found" });
        }
    }
    catch (error) {
        console.error('Error fetching repository:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};