'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RequestProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RequestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Requests',
          key: 'id',
        }
      },
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        }
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }).then(async () => {
      const transaction = await queryInterface.sequelize.transaction();
      try{
        await queryInterface.addIndex(
          'RequestProducts',
          {
            fields: ['RequestId', 'ProductId'],
            unique: true,
            transaction,
          }
        );
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RequestProducts');
  }
};
