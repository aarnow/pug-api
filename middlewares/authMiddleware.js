const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = { id: payload.sub, email: payload.email };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware;