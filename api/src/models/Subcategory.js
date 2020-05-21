const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Subcategory = sequelize.define('Subcategory', {
        name: DataTypes.STRING,
        CategoryId: DataTypes.INTEGER
    });
    Subcategory.associate = function (models) {
        Subcategory.belongsTo(models.Category, {
            foreingKey: 'CategoryId',
            onDelete: 'cascade'
        })
    };

    return Subcategory;
}