const express = require('express');
const router = express.Router();
const PenulisController = require('../controllers/penulisController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, PenulisController.getAllPenuliss);
router.post('/', verifyToken, PenulisController.createPenulis);
router.put('/:id', verifyToken, PenulisController.updatePenulis);
router.delete('/:id', verifyToken, PenulisController.deletePenulis);

module.exports = router;
