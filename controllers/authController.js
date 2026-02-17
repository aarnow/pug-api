const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User, Role } = require('../models');

const SALT_ROUNDS = 10;
const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateToken(user) {
    return jwt.sign(
        { sub: user.id, email: user.email },
        JWT_SECRET,
        { algorithm: 'HS256', expiresIn: JWT_EXPIRES }
    );
}

function formatRoles(roles) {
    return roles.map((r) => r.name);
}

// ── Register ─────────────────────────────────────────────────────────────────
async function register(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'password must be at least 8 characters' });
    }

    try {
        const existing = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existing) {
            return res.status(409).json({ error: 'email already in use' });
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            email:    email.toLowerCase(),
            password: hashed,
        });

        const userRole = await Role.findOne({ where: { name: 'ROLE_USER' } });
        if (userRole) {
            await user.addRole(userRole);
        }

        // Recharger le user avec ses rôles
        const roles = await user.getRoles();

        const token = generateToken(user);

        return res.status(201).json({
            message: 'User created',
            token,
            userId: user.id,
            roles:  formatRoles(roles),
        });

    } catch (err) {
        next(err);
    }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        const user = await User.findOne({
            where:   { email: email.toLowerCase() },
            include: [{ model: Role }],
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: 'User connected',
            token,
            userId: user.id,
            roles:  formatRoles(user.Roles),
        });

    } catch (err) {
        next(err);
    }
}

module.exports = { register, login };