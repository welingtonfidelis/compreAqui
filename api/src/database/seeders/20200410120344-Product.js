'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Products' },
      [
        {
          BrandId: 1,
          SizeId: 1,
          name: "Produto 1",
          description: "Produto 1 descrição",
          price: 22.50,
          stock: 10,
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          BrandId: 1,
          SizeId: 2,
          name: "Produto 2",
          description: "Produto 2 descrição",
          price: 10.50,
          stock: 5,
          ProviderId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          BrandId: 2,
          SizeId: 1,
          name: "Produto 3",
          description: "Produto 3 descrição",
          price: 10,
          stock: 100,
          ProviderId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          BrandId: 2,
          SizeId: 2,
          name: "Produto 4",
          description: "Produto 4 descrição",
          price: 1500.50,
          stock: 10000,
          ProviderId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        

      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Products' },
      [{}])
  }
};
