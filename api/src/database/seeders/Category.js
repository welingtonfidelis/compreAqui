'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Categories' },
      [
        {
          name: 'Alimentação',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Construção',
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Categories' },
      [{}])
  }
};
