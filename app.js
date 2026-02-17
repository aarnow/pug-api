const express = require('express');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const indexRouter  = require('./routes/index');
const healthRouter = require('./routes/health');
const authRouter   = require('./routes/authRouter');

app.use('/', indexRouter);
app.use('/health', healthRouter);
app.use('/auth', authRouter);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;