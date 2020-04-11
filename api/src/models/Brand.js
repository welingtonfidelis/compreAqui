module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        UserId: DataTypes.INTEGER,
        description: DataTypes.STRING
    },
        {
            tableName: 'Brands',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Brand.associate = function (models) {
        Brand.belongsTo(models.User, {
            foreingKey: 'UserId'
        })
    }

    return Brand;
}