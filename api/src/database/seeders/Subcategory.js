'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Subcategories' },
      [
        {
          name: 'Lanchonete',
          CategoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Aluguel Ferramentas',
          CategoryId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Subcategories' },
      [{}])
  }
};
