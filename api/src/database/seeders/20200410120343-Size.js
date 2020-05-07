'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Sizes' },
      [
        {
          sizeDescription: 'Tamanho 1',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          sizeDescription: 'Tamanho 2',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          sizeDescription: 'Tamanho 3',
          ProviderId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          sizeDescription: 'Tamanho 4',
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
