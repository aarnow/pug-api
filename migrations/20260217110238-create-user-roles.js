'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('user_roles', {
            user_id: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'users', key: 'id' },
                onDelete:   'CASCADE',
            },
            role_id: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'roles', key: 'id' },
                onDelete:   'CASCADE',
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

        // Clé primaire composite
        await queryInterface.addConstraint('user_roles', {
          fields: ['user_id', 'role_id'],
          type:   'primary key',
          name:   'user_roles_pkey',
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('user_roles');
    }
};
