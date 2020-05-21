'use strict';

const uuid = require('uuid/v4');
const { User } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({
      attributes: ['id']
    });

    return queryInterface.bulkInsert({ tableName: 'Brands' },
      [
        {
          brandDescription: 'Marca 1',
          ProviderId: user[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 2',
          ProviderId: user[0].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 3',
          ProviderId: user[1].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          brandDescription: 'Marca 4',
          ProviderId: user[1].id,
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
