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

// ── Modèles ───────────────────────────────────────────────────────────────────
const User         = require('./User')(sequelize);
const Role         = require('./Role')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);

// ── Associations ──────────────────────────────────────────────────────────────

// ManyToMany User <-> Role
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

// OneToMany User -> RefreshToken
User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Role, RefreshToken };