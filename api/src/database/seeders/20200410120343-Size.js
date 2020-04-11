'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Sizes' },
      [
        {
          description: 'Tamanho 1',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 2',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 3',
          ProviderId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          description: 'Tamanho 4',
          ProviderId: 2,
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
