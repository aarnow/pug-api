const express = require('express');
const router = express.Router();
const { testConnection } = require('../db');

router.get('/', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        api: 'up',
        database: 'unknown',
    };

    try {
        await testConnection();
        health.database = 'up';
        res.status(200).json(health);
    } catch (err) {
        health.status = 'error';
        health.database = 'down';
        health.error = err.message;
        res.status(503).json(health);
    }
});

module.exports = router;