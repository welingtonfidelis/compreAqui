const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    description: DataTypes.STRING,
    code: DataTypes.STRING,
  }, {});

  return State;
}