// database.js
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
dotenv.config();


// Buat koneksi ke database
const sequelize = new Sequelize('db_books', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: '8889'
});

// Cek koneksi ke database
try {
  sequelize.authenticate();
  console.log('Connection to the database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;
