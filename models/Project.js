'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Project', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // define the table's name
    tableName: 'Projects',

    name: {
      singular: 'Project',
      plural: 'Projects',
    },

    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    deletedAt: 'destroyTime',
    paranoid: true
  })
};