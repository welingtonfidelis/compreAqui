module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        UserId: DataTypes.INTEGER,
        BrandId: DataTypes.INTEGER,
        SizeId: DataTypes.INTEGER,
        description: DataTypes.STRING,
        price: DataTypes.REAL,
        stock: DataTypes.INTEGER,
    },
        {
            tableName: 'Products',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Product.associate = function (models) {
        Product.belongsTo(models.User, {
            foreingKey: 'UserId',
        }),
        Product.belongsTo(models.Brand, {
            foreingKey: 'BrandId',
        }),
        Product.belongsTo(models.Size, {
            foreingKey: 'SizeId',
        })
    }
    return Product;
}