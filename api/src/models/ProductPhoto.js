const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const ProductPhoto = sequelize.define('ProductPhoto', {
        ProductId: DataTypes.INTEGER,
        photoUrl: DataTypes.STRING
    });
    ProductPhoto.associate = function (models) {
        ProductPhoto.belongsTo(models.Product, {
            foreingKey: 'ProductId',
            as: 'Product'
        })
    };

    return ProductPhoto;
}