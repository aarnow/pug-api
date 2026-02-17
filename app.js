const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const indexRouter = require('./routes/index');
const healthRouter = require('./routes/health');

app.use('/', indexRouter);
app.use('/health', healthRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;