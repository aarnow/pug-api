const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:    process.env.DB_HOST,
        port:    parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        },
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
    }
);

const User = require('./User')(sequelize);
const Role = require('./Role')(sequelize);

User.belongsToMany(Role, {
    through:     'user_roles',
    foreignKey:  'user_id',
    otherKey:    'role_id',
    timestamps:  true,
    underscored: true,
});

Role.belongsToMany(User, {
    through:     'user_roles',
    foreignKey:  'role_id',
    otherKey:    'user_id',
    timestamps:  true,
    underscored: true,
});

module.exports = { sequelize, User, Role };