const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const Penerbit = sequelize.define('tb_penulis', {
  id_penulis  : {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  penulis: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'tb_penulis',
});

module.exports = Penerbit;
