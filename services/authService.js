const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Role, RefreshToken } = require('../models');

const SALT_ROUNDS              = 10;
const JWT_SECRET               = process.env.JWT_SECRET;
const JWT_EXPIRES              = process.env.JWT_EXPIRES_IN              || '15m';
const REFRESH_TOKEN_DAYS       = parseInt(process.env.REFRESH_TOKEN_DAYS       || '7');
const REFRESH_TOKEN_INACTIVITY = parseInt(process.env.REFRESH_TOKEN_INACTIVITY || '3');

// ── Helpers privés ────────────────────────────────────────────────────────────
function generateAccessToken(user) {
    return jwt.sign(
        { sub: user.id, email: user.email },
        JWT_SECRET,
        { algorithm: 'HS256', expiresIn: JWT_EXPIRES }
    );
}

function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

function getRefreshTokenExpiry() {
    const date = new Date();
    date.setDate(date.getDate() + REFRESH_TOKEN_DAYS);
    return date;
}

function formatRoles(roles) {
    return roles.map((r) => r.name);
}

async function revokeAllUserTokens(userId) {
    await RefreshToken.update(
        { revoked: true },
        { where: { user_id: userId, revoked: false } }
    );
}

// ── Register ──────────────────────────────────────────────────────────────────
async function register(email, password) {
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
        const error = new Error('email already in use');
        error.status = 409;
        throw error;
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user   = await User.create({ email: email.toLowerCase(), password: hashed });

    const editorRole = await Role.findOne({ where: { name: 'ROLE_EDITOR' } });
    if (editorRole) await user.addRole(editorRole);

    const roles        = await user.getRoles();
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
        token:      refreshToken,
        user_id:    user.id,
        expires_at: getRefreshTokenExpiry(),
    });

    return {
        message:       'User created',
        access_token:  accessToken,
        refresh_token: refreshToken,
        userId:        user.id,
        roles:         formatRoles(roles),
    };
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function login(email, password) {
    const user = await User.findOne({
        where:   { email: email.toLowerCase() },
        include: [{ model: Role }],
    });

    if (!user) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    await revokeAllUserTokens(user.id);

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
        token:      refreshToken,
        user_id:    user.id,
        expires_at: getRefreshTokenExpiry(),
    });

    return {
        message:       'User connected',
        access_token:  accessToken,
        refresh_token: refreshToken,
        userId:        user.id,
        roles:         formatRoles(user.Roles),
    };
}

// ── Refresh ───────────────────────────────────────────────────────────────────
async function refresh(refreshToken) {

    const stored = await RefreshToken.findOne({
        where: { token: refreshToken },
    });

    if (!stored) {
        const error = new Error('Invalid refresh token');
        error.status = 401;
        throw error;
    }

    // Reuse detection
    if (stored.revoked) {
        await revokeAllUserTokens(stored.user_id);
        const error = new Error('Refresh token reuse detected - please login again');
        error.status = 401;
        throw error;
    }

    // Token expiré
    if (stored.expires_at < new Date()) {
        await stored.update({ revoked: true });
        const error = new Error('Refresh token expired');
        error.status = 401;
        throw error;
    }

    // inactif
    const inactivityLimit = new Date();
    inactivityLimit.setDate(inactivityLimit.getDate() - REFRESH_TOKEN_INACTIVITY);
    const lastActivity = stored.last_used_at || stored.created_at;

    if (lastActivity < inactivityLimit) {
        await stored.update({ revoked: true });
        const error = new Error('Session expired due to inactivity - please login again');
        error.status = 401;
        throw error;
    }

    const user = await User.findByPk(stored.user_id);
    if (!user) {
        const error = new Error('User not found');
        error.status = 401;
        throw error;
    }

    // revoke l'ancien token et genere un nouveau
    await stored.update({ revoked: true, last_used_at: new Date() });

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();

    await RefreshToken.create({
        token:      newRefreshToken,
        user_id:    user.id,
        expires_at: getRefreshTokenExpiry(),
    });

    return {
        access_token:  newAccessToken,
        refresh_token: newRefreshToken,
    };
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout(refreshToken) {
    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (stored) {
        await stored.update({ revoked: true });
    }

    return { message: 'Logged out successfully' };
}

module.exports = { register, login, refresh, logout };