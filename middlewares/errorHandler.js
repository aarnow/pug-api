// ── 404 ─────────────────────────────────────────────────────────────────────
function notFound(req, res, next) {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// ── 500 ─────────────────────────────────────────────────────────────────────
function errorHandler(err, req, res, next) {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
}

module.exports = { notFound, errorHandler };