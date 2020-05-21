'use strict';

const uuid = require('uuid/v4');
const { User, Subcategory, Size, Brand } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({
      attributes: ['id']
    });
    const subcat = await Subcategory.findAll({
      attributes: ['id']
    });
    const size = await Size.findAll({
      attributes: ['id']
    });
    const brand = await Brand.findAll({
      attributes: ['id']
    });

    const products = [];
    for (let i = 1; i <= 50; i++) {
      products.push(
        {
          BrandId: brand[Math.floor(Math.random() * brand.length)].id,
          SizeId: size[Math.floor(Math.random() * size.length)].id,
          SubcategoryId: subcat[Math.floor(Math.random() * subcat.length)].id,
          name: `Produto ${i}`,
          description: `Produto ${i} descrição`,
          price: Math.floor(Math.random() * (10000 - 100) + 100) / 100,
          stock: Math.floor(Math.random() * 100),
          ProviderId: user[Math.floor(Math.random() * user.length)].id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      )
    }
    return queryInterface.bulkInsert({ tableName: 'Products' }, products)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Products' }, [{}])
  }
};
