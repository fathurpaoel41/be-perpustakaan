const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowingController');
const verifyToken = require('../middleware/verifyToken');

// Mendapatkan semua data peminjam
router.get('/', verifyToken, BorrowingController.getAllBorrowings);

// Membuat data baru peminjaman
router.post('/', verifyToken, BorrowingController.createBorrowing);

// Mengupdate data peminjaman berdasarkan ID
router.put('/:id', verifyToken, BorrowingController.updateBorrowing);

// Mendapatkan data peminjaman dengan filter
router.post('/filter', verifyToken, BorrowingController.filterBorrowings);

// Mengirim email notifikasi
router.post('/email-notification', verifyToken, BorrowingController.sendEmailNotification);

//menghspu peminjaman buku
router.delete('/:id', verifyToken, BorrowingController.deleteBorrowing);

module.exports = router;