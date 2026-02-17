const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {
            type:          DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:    true,
        },
        token: {
            type:      DataTypes.TEXT,
            allowNull: false,
            unique:    true,
        },
        user_id: {
            type:      DataTypes.INTEGER,
            allowNull: false,
        },
        expires_at: {
            type:      DataTypes.DATE,
            allowNull: false,
        },
        last_used_at: {
            type:      DataTypes.DATE,
            allowNull: true,
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName:   'refresh_tokens',
        timestamps:  true,
        underscored: true,
    });

    return RefreshToken;
};