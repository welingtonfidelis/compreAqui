module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        ClientId: DataTypes.INTEGER,
        ProviderId: DataTypes.INTEGER,
        timeWait: DataTypes.INTEGER,
        value: DataTypes.REAL,
        status: DataTypes.STRING,
        delivery: DataTypes.BOOLEAN,
        cashBack: DataTypes.REAL,
        observation: DataTypes.STRING,
        reason: DataTypes.STRING
    },
        {
            tableName: 'Requests',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Request.associate = function (models) {
        Request.belongsTo(models.User, {
            foreingKey: 'ProviderId',
            as: 'Provider'
        }),
        Request.belongsTo(models.User, {
            foreingKey: 'ClientId',
            as: 'Client'
        }),
        Request.hasMany(models.RequestProduct, {
            foreingKey: 'RequestId'
        })
    }
    return Request;
}