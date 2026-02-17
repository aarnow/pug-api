'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('users', {
          id: {
              type:          Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey:    true,
              allowNull:     false,
          },
          email: {
              type:      Sequelize.STRING(255),
              allowNull: false,
              unique:    true,
          },
          password: {
              type:      Sequelize.STRING(255),
              allowNull: false,
          },
          created_at: {
              type:      Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('NOW()'),
          },
          updated_at: {
              type:      Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('NOW()'),
          },
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('users');
  }
};
