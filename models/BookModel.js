// models/User.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const Categories = require('./CategoriesModel')
const Penerbit = require('./PenerbitModel')
const Penulis = require('./PenulisModel')

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
    allowNull: true,
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

// Definisikan asosiasi antara Buku dan category
Books.belongsTo(Categories, { foreignKey: 'id_categories' });
Categories.hasMany(Books, { foreignKey: 'id_categories' });

// Definisikan asosiasi antara Buku dan Penerbit
Books.belongsTo(Penerbit, { foreignKey: 'id_penerbit' });
Penerbit.hasMany(Books, { foreignKey: 'id_penerbit' });

// Definisikan asosiasi antara Buku dan Penulis
Books.belongsTo(Penulis, { foreignKey: 'id_penulis' });
Penulis.hasMany(Books, { foreignKey: 'id_penulis' });


module.exports = Books;
