'use strict';

const uuid = require('uuid/v4');
const { Category } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const cat = await Category.findAll({
      attributes: ['id']
    });

    return queryInterface.bulkInsert({ tableName: 'Subcategories' },
      [
        {
          name: 'Lanchonete',
          CategoryId: cat[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Aluguel Ferramentas',
          CategoryId: cat[1].id,
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
