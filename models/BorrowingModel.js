const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./UserModel'); // Import model User
const Book = require('./BookModel'); // Import model Book

const BorrowingBooks = sequelize.define('tb_borrowing_book', {
  id_borrowing: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  id_user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_book: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tanggal_peminjaman: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tanggal_pengembalian: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status_peminjaman: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'tb_borrowing_book',
});

// Definisikan asosiasi antara BorrowingBooks dan User
BorrowingBooks.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(BorrowingBooks, { foreignKey: 'id_user' });

// Definisikan asosiasi antara BorrowingBooks dan Book
BorrowingBooks.belongsTo(Book, { foreignKey: 'id_book' });
Book.hasMany(BorrowingBooks, { foreignKey: 'id_book' });

module.exports = BorrowingBooks; 