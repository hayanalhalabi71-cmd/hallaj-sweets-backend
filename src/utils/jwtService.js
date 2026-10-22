const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role: role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' } 
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
};

module.exports = {
    generateToken,
    verifyToken
};