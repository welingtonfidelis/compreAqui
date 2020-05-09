'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'RequestProducts' },
      [
        {
          RequestId: 1,
          ProductId: 1,
          amount: 2,
          price: 5.50,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          RequestId: 2,
          ProductId: 2,
          amount: 5,
          price: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          RequestId: 3,
          ProductId: 1,
          amount: 10,
          price: 9.90,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'RequestProducts' },
      [{}])
  }
};
