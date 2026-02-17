'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('refresh_tokens', {
            id: {
                type:          Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey:    true,
                allowNull:     false,
            },
            token: {
                type:      Sequelize.TEXT,
                allowNull: false,
                unique:    true,
            },
            user_id: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'users', key: 'id' },
                onDelete:   'CASCADE',
            },
            expires_at: {
                type:      Sequelize.DATE,
                allowNull: false,
            },
            last_used_at: {
                type:      Sequelize.DATE,
                allowNull: true,
            },
            revoked: {
                type:         Sequelize.BOOLEAN,
                allowNull:    false,
                defaultValue: false,
            },
            created_at: {
                type:         Sequelize.DATE,
                allowNull:    false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updated_at: {
                type:         Sequelize.DATE,
                allowNull:    false,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('refresh_tokens');
    },
};