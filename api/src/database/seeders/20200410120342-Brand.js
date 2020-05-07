'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Brands' },
      [
        {
          brandDescription: 'Marca 1',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 2',
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 3',
          ProviderId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 4',
          ProviderId: 2,
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
