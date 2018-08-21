'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Resource', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    src: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  }, {
    // define the table's name
    tableName: 'Resources',

    name: {
      singular: 'Resource',
      plural: 'Resources',
    },

    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    deletedAt: 'destroyTime',
    paranoid: true
  })
};