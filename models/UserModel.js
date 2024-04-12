// models/User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('tb_users', {
  // Define struktur model disini
  id_user: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nama_user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ttl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_telp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verifiedEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Nonaktifkan timestamps
  timestamps: false,
  tableName: 'tb_users',
});

module.exports = User;
