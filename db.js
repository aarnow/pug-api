const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME     || 'pugapi',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
});

/**
 * Test the DB connection (used by /health)
 */
async function testConnection() {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
}

module.exports = { pool, testConnection };