const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) 
            return res.status(401).json({message: 'No Authentication Token, Access denied.'})
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.id;

        next();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = auth;