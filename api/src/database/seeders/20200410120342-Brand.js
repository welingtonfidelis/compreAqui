'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Brands' },
      [
        {
          description: 'Marca 1',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Marca 2',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Marca 3',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Marca 4',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Brands' },
      [{}])
  }
};
