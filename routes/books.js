const express = require('express');
const router = express.Router();
const BooksController = require('../controllers/booksController');
const verifyToken = require('../middleware/verifyToken');
const { upload, resizeImage } = require('../config/uploadConfig');

// Mendapatkan semua data buku
router.get('/', verifyToken, BooksController.getAllBooks);

// Membuat buku baru
router.post('/', verifyToken, upload.single('gambar'), BooksController.createBook);

// Mengupdate buku berdasarkan ID
router.put('/:id', verifyToken, upload.single('gambar'), BooksController.updateBook);

// Menghapus buku berdasarkan ID
router.delete('/:id', verifyToken, BooksController.deleteBook);

// Mendapatkan buku dengan filter
router.post('/filter', verifyToken, BooksController.filterBooks);

module.exports = router;