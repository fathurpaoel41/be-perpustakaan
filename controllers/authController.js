// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const jwtConfig = require('../config/jwt.config');
const { body, validationResult } = require('express-validator');

class AuthController {
  // Rute untuk login
  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Validasi email
        body('email').isEmail().normalizeEmail();

        // Validasi password
        body('password').isLength({ min: 6 });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(401).json({ message: 'Email atau kata sandi salah' });
        }

        // Verifikasi kata sandi
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Jika kata sandi salah
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau kata sandi salah' });
        }

        // Generate token JWT
        const token = jwt.sign({ userId: user.id_user }, jwtConfig.secret, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

  // Rute untuk logout
  static logout(req, res) {
    // Mengambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak diberikan' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Memverifikasi token untuk memastikan bahwa token masih valid
      jwt.verify(token, jwtConfig.secret);

      // Token valid, logout berhasil
      res.json({ message: 'Logout berhasil' });
    } catch (err) {
      // Token tidak valid atau kedaluwarsa
      res.status(403).json({ message: 'Token tidak valid' });
    }
  }

  // Rute untuk memeriksa token
  static checkToken(req, res) {
    // Mengambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak diberikan' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Memverifikasi token
      const decoded = jwt.verify(token, jwtConfig.secret);

      // Token valid
      res.json({ tokenValid: true, decodedToken: decoded });
    } catch (err) {
      // Token tidak valid atau kedaluwarsa
      res.status(403).json({ tokenValid: false, message: 'Token tidak valid' });
    }
  }
}

module.exports = AuthController;
