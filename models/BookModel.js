// models/User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const Books = sequelize.define('tb_book', {
  // Define struktur model disini
  id_book: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  judul_buku: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_penerbit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_penulis: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_buku: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
        min: 0
    }
  },
  id_categories: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('gambar');
      return rawValue ? `http://localhost:4000/${rawValue}` : null;
    }
  }
}, {
  // Nonaktifkan timestamps
  timestamps: false,
  tableName: 'tb_book',
});

module.exports = Books;
