const pool = require('../supaBase');

module.exports.getTeams = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
};

