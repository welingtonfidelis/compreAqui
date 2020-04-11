module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        UserId: DataTypes.INTEGER,
        description: DataTypes.STRING,
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
            foreingKey: 'UserId',
        })
    }

    return Size;
}