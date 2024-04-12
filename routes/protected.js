
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Rute yang dilindungi
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Selamat datang di area yang dilindungi!' });
});

module.exports = router;