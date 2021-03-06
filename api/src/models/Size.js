const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        ProviderId: DataTypes.INTEGER,
        sizeDescription: DataTypes.STRING,
    },
        {
            tableName: 'Sizes',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Size.associate = function (models) {
        Size.belongsTo(models.User, {
            foreingKey: 'ProviderId',
            as: "Provider"
        })
    };

    return Size;
}