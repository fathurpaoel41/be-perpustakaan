// app.js

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models/db'); // Import koneksi database dari file terpisah
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const borrowingRouter = require('./routes/borrowingbook');
const categoryRouter = require('./routes/categories');
const penulisRouter = require('./routes/penulis');
const penerbitRouter = require('./routes/penerbit');
const schedule = require('node-schedule');
const swaggerDocs = require('./swagger');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
swaggerDocs(app);

// Routes
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/borrowingbook', borrowingRouter);
app.use('/category', categoryRouter);
app.use('/penulis', penulisRouter);
app.use('/penerbit', penerbitRouter);
app.use('/api/auth', authRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//schedule
// Fungsi yang akan dijalankan setiap jam 6 pagi
function scheduledFunction() {
  console.log('Fungsi ini dijalankan setiap jam 6 pagi');
  // Tambahkan logika yang ingin Anda jalankan di sini
}

// Membuat jadwal untuk menjalankan fungsi setiap jam 6 pagi
const scheduledJob = schedule.scheduleJob('37 14 * * *', scheduledFunction);

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
