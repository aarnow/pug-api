const { Pool } = require('pg');

const pool = new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'pugapi',
    // En production sur Render, la connexion passe par SSL
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Test the DB connection (used by /health)
 */
async function testConnection() {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
}

module.exports = { pool, testConnection };