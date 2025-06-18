const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
