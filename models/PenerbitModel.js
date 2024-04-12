const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const Penerbit = sequelize.define('tb_penerbit', {
  id_penerbit : {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  penerbit: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'tb_penerbit',
});

module.exports = Penerbit;
