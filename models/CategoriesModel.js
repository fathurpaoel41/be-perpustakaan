const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const Categories = sequelize.define('tb_categories', {
  id_category: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'tb_categories',
});

module.exports = Categories;
