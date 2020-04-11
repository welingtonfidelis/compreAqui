'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Sizes' },
      [
        {
          description: 'Tamanho 1',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 2',
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 3',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 4',
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Sizes' },
      [{}])
  }
};
