const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    console.error('JWT_SECRET is not defined');
}

const handleError = (res, message) => {
    console.error(message);
    return res.status(401).json({ error: message });
};

// Middleware to authenticate and extract userType from token
const authenticate = (req, res, next) => {
    console.log("Middleware");
    
    const token = req.cookies.gloum_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log('Extracted Token:', token);

    if (!token) {
        return handleError(res, 'No token provided, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (!decoded.userType) {
            return handleError(res, 'Invalid token: user type missing');
        }

        if (process.env.DEBUG) {
            console.log(`User authenticated: ${decoded.email}, UserType: ${decoded.userType}`);
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            userType: decoded.userType,
        };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return handleError(res, 'Token has expired');
        }
        console.error('Token Verification Error:', err.message);
        return handleError(res, 'Invalid token');
    }
};

// Middleware to authorize user based on required userType
const authorizeRole = (requiredUserType) => {
    return (req, res, next) => {
        if (req.user && req.user.userType === requiredUserType) {
            if (process.env.DEBUG) {
                console.log(`Authorization successful: ${req.user.email}, UserType: ${req.user.userType}`);
            }
            return next(); // User is authorized
        }
        console.log(`Authorization failed for ${req.user.email}. Required: ${requiredUserType}, Found: ${req.user.userType}`);
        return res.status(403).json({ error: `Access denied. ${requiredUserType.charAt(0).toUpperCase() + requiredUserType.slice(1)}s only.` });
    };
};

// Middleware to check user roles
const authenticateAdmin = authorizeRole('admin');
const authenticateConsultant = authorizeRole('consultant');
const authenticateUser = authorizeRole('user');

module.exports = {
    authenticate,
    authenticateAdmin,
    authenticateConsultant,
    authenticateUser,
};
