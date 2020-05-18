'use strict';
const categoryList = [
  'Alimentação', 'Aluguel', 'Construção', 'Super Mercado', 'Assist Técnica',
  'Mecânico'
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    const categories = [];
    for (let el of categoryList) {
      categories.push(
        {
          name: el,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }
    return queryInterface.bulkInsert({ tableName: 'Categories' }, categories)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Categories' },
      [{}])
  }
};
