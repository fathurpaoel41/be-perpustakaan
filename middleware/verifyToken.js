const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
  // Mengambil token dari header Authorization
  const authHeader = req.headers.authorization;

  // Jika tidak ada header Authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }

  // Memverifikasi token
  const token = authHeader.split(' ')[1]; // Mengambil token dari Bearer <token>
  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    // Menyimpan data decoded token ke dalam objek req
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;