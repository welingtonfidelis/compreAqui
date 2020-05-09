'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Requests' },
      [
        {
          ClientId: 3,
          ProviderId: 1,
          value: 50.90,
          status: "pending",
          delivery: true,
          cashBack: 100,
          observation: "Entregar no 250B",
          timeWait: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ClientId: 4,
          ProviderId: 1,
          value: 15.50,
          status: "pending",
          delivery: false,
          cashBack: 20,
          observation: "",
          timeWait: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ClientId: 3,
          ProviderId: 2,
          value: 51,
          status: "pending",
          delivery: true,
          cashBack: 60,
          observation: "Entregar no 250B",
          timeWait: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Requests' },
      [{}])
  }
};
