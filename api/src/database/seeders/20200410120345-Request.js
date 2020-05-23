'use strict';

const uuid = require('uuid/v4');
const { User } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const client = await User.findAll({
      where: {type: 'client'},
      attributes: ['id']
    });
    const comercial = await User.findAll({
      where: {type: 'comercial'},
      attributes: ['id']
    });

    const requests = [];
    for(let i = 1; i <= 15; i++){
      requests.push(
        {
          ClientId: client[Math.floor(Math.random() * client.length)].id,
          ProviderId: comercial[Math.floor(Math.random() * comercial.length)].id,
          value: Math.floor(Math.random() * (1000 - 100) + 100) / 100,
          status: "pending",
          delivery: true,
          cash: true,
          cashBack: Math.floor(Math.random() * 100),
          observation: "Entregar no 250B",
          timeWait: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      )
    }
    return queryInterface.bulkInsert({ tableName: 'Requests' }, requests)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Requests' },
      [{}])
  }
};
