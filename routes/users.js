const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const verifyToken = require('../middleware/verifyToken');

// Mendapatkan semua user
router.get('/', verifyToken, UsersController.getAllUsers);

// GET users with filter by role and date range
router.post('/filter', verifyToken, UsersController.filterUsers);

// Mendapatkan user berdasarkan ID
router.get('/:id', verifyToken, UsersController.getUserById);

// Membuat user baru
router.post('/', UsersController.createUser);

// Rute untuk memverifikasi email
router.get('/verify/:verificationToken', UsersController.verifyEmail);

// Mengupdate user berdasarkan ID
router.put('/:id', verifyToken, UsersController.updateUser);

// Menghapus user berdasarkan ID
router.delete('/:id', verifyToken, UsersController.deleteUser);

module.exports = router;