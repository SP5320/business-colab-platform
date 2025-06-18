const pool = require('../supaBase');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `
            SELECT * 
            FROM employees 
            WHERE email_id = $1
               AND password = $2
        `;

        const result = await pool.query(query, [email, password]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found or password is incorrect' });
        } else {
            const userFirstName = result.rows[0].first_name;
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '3d' });
            res.status(200).json({ "message": "User logged in successfully", "token": token, "user": userFirstName });
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).send(`Error Message: ${error.message}`);
    }
}