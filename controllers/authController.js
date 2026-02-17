const authService = require('../services/authService');

// ── Register ──────────────────────────────────────────────────────────────────
async function register(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'password must be at least 8 characters' });
    }

    try {
        const result = await authService.register(email, password);
        return res.status(201).json(result);
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
        const result = await authService.login(email, password);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

// ── Refresh ───────────────────────────────────────────────────────────────────
async function refresh(req, res, next) {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: 'refresh_token is required' });
    }

    try {
        const result = await authService.refresh(refresh_token);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

// ── Logout ────────────────────────────────────────────────────────────────────
async function logout(req, res, next) {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: 'refresh_token is required' });
    }

    try {
        const result = await authService.logout(refresh_token);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login, refresh, logout };