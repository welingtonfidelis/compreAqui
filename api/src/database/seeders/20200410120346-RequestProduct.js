'use strict';

const uuid = require('uuid/v4');
const { Request, Product } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const product = await Product.findAll({
      attributes: ['id']
    });
    const request = await Request.findAll({
      attributes: ['id']
    });

    const requestProducts = [];
    for(let i = 1; i <= 15; i++) {
      requestProducts.push(
        {
          RequestId: request[Math.floor(Math.random() * request.length)].id,
          ProductId: product[Math.floor(Math.random() * product.length)].id,
          amount: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * (1000 - 100) + 100) / 100,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }
    return queryInterface.bulkInsert({ tableName: 'RequestProducts' }, requestProducts)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'RequestProducts' },
      [{}])
  }
};
