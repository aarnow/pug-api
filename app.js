const express    = require('express');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes système ───────────────────────────────────────
app.use('/',       require('./routes/index'));
app.use('/health', require('./routes/health'));

// ── public
app.use('/api/auth', require('./routes/authRouter'));

// ── protected
app.use('/api/test', require('./routes/testRouter'));

// ── Gestion des erreurs ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;