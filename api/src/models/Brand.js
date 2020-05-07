module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        ProviderId: DataTypes.INTEGER,
        brandDescription: DataTypes.STRING
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
            foreingKey: 'ProviderId',
            as: "Provider"
        })
    }

    return Brand;
}