const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Middleware to authenticate and extract userType from token
const authenticate = (req, res, next) => {
    console.log("middleware");
    
    console.log('Cookies:', req.cookies);
    console.log('Authorization Header:', req.headers.authorization);

    const token = req.cookies.gloum_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Check if userType exists in the token
        if (!decoded.userType) {
            return res.status(401).json({ error: 'Invalid token: user type missing' });
        }

        // Log the userType for debugging purposes
        console.log(`User authenticated: ${decoded.email}, UserType: ${decoded.userType}`);

        // Store the decoded token data (including userType) in the request object
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        console.error('Token Verification Error:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to authorize user based on required userType
const authorizeRole = (requiredUserType) => {
    return (req, res, next) => {
        // Check if the userType from the token matches the required role
        if (req.user && req.user.userType === requiredUserType) {
            console.log(`Authorization successful: ${req.user.email}, UserType: ${req.user.userType}`);
            return next(); // User is authorized
        }
        console.log(`Authorization failed for ${req.user.email}. Required: ${requiredUserType}, Found: ${req.user.userType}`);
        return res.status(403).json({ error: `Access denied. ${requiredUserType.charAt(0).toUpperCase() + requiredUserType.slice(1)}s only.` });
    };
};

// Middleware to check if user is admin
const authenticateAdmin = authorizeRole('admin');

// Middleware to check if user is consultant
const authenticateConsultant = authorizeRole('consultant');

// Middleware to check if user is a general user (e.g., customer, employee)
const authenticateUser = authorizeRole('user');

module.exports = {
    authenticate,
    authenticateAdmin,
    authenticateConsultant,
    authenticateUser,
};
