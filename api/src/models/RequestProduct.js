module.exports = (sequelize, DataTypes) => {
    const RequestProduct = sequelize.define('RequestProduct', {
        RequestId: DataTypes.INTEGER,
        ProductId: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
    },
        {
            tableName: 'RequestProducts',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    RequestProduct.associate = function (models) {
        RequestProduct.belongsTo(models.Request, {
            foreingKey: 'RequestId',
        }),
        RequestProduct.belongsTo(models.Product, {
            foreingKey: 'ProductId'
        })
    }
    return RequestProduct;
}