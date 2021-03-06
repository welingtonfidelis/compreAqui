const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING,
        photoUrl: DataTypes.STRING
    });
    
    return Category;
}