// ── GET /api/test/all ─────────────────────────────────────────────────────────
function publicAccess(req, res) {
    res.status(200).json({ message: 'Public content - accessible by everyone' });
}

// ── GET /api/test/user ────────────────────────────────────────────────────────
function userAccess(req, res) {
    res.status(200).json({
        message: 'User content - accessible by ROLE_USER',
        user: req.user,
    });
}

// ── GET /api/test/editor ─────────────────────────────────────────────────────────
function editorAccess(req, res) {
    res.status(200).json({
        message: 'Moderator content - accessible by ROLE_EDITOR',
        user: req.user,
    });
}

// ── GET /api/test/moderator ─────────────────────────────────────────────────────────
function moderatorAccess(req, res) {
    res.status(200).json({
        message: 'Moderator content - accessible by ROLE_MODERATOR',
        user: req.user,
    });
}

// ── GET /api/test/admin ───────────────────────────────────────────────────────
function adminAccess(req, res) {
    res.status(200).json({
        message: 'Admin content - accessible by ROLE_ADMIN',
        user: req.user,
    });
}

module.exports = { publicAccess, userAccess, editorAccess, moderatorAccess, adminAccess };