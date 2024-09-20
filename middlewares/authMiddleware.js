const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    // Log the incoming cookies and headers for debugging purposes
    console.log('Cookies:', req.cookies);
    console.log('Authorization Header:', req.headers.authorization);

    // Look for the token in the 'gloum_token' cookie or in the 'Authorization' header
    const token = req.cookies.gloum_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message); // Log any errors during verification
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
