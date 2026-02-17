const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type:          DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:    true,
        },
        email: {
            type:      DataTypes.STRING(255),
            allowNull: false,
            unique:    true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type:      DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName:  'users',
        timestamps: true,
        underscored: true,
    });

    return User;
};