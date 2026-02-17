require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT || '5432'),
        dialect:  'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        },
        logging: console.log,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT || '5432'),
        dialect:  'postgres',
        dialectOptions: {
            ssl: { rejectUnauthorized: false },
        },
        logging: false,
    },
};