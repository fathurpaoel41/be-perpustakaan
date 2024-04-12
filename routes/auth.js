// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/check-token', AuthController.checkToken);

module.exports = router;
