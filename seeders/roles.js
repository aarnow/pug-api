'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('roles', [
            {
                name:       'ROLE_USER',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name:       'ROLE_EDITOR',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name:       'ROLE_ADMIN',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ], {
            ignoreDuplicates: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('roles', {
            name: ['ROLE_USER', 'ROLE_EDITOR', 'ROLE_ADMIN'],
        });
    },
};