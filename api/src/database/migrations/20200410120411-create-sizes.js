'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProviderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
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
          'Sizes',
          {
            fields: ['description', 'ProviderId'],
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
    return queryInterface.dropTable('Sizes');
  }
};
