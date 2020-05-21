const uud = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        ProviderId: DataTypes.INTEGER,
        BrandId: DataTypes.INTEGER,
        SizeId: DataTypes.INTEGER,
        SubcategoryId: DataTypes.INTEGER,
        name: DataTypes.STRING,
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
            foreingKey: 'ProviderId',
            as: 'Provider'
        }),
        Product.belongsTo(models.Brand, {
            foreingKey: 'BrandId',
        }),
        Product.belongsTo(models.Size, {
            foreingKey: 'SizeId',
        }),
        Product.belongsTo(models.Subcategory, {
            foreingKey: 'SubcategoryId',
        }),
        Product.hasMany(models.ProductPhoto, {
            foreingKey: 'ProductId'
        })
    };

    return Product;
}