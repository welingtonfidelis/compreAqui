module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        doc: DataTypes.STRING,
        email: DataTypes.STRING,
        phone1: DataTypes.STRING,
        phone2: DataTypes.STRING,
        user: DataTypes.STRING,
        birth: DataTypes.DATE,
        password: DataTypes.STRING,
        tokenReset: DataTypes.STRING,
        type: DataTypes.STRING,
        AddressId: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE
    },
        {
            tableName: 'Users',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    User.associate = function (models) {
        User.belongsTo(models.Address, {
            foreingKey: 'AddressId',
            onDelete: 'cascade'
        })
    }

    return User;
}