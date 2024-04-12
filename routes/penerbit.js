const express = require('express');
const router = express.Router();
const PenerbitController = require('../controllers/penerbitController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, PenerbitController.getAllPenerbits);
router.post('/', verifyToken, PenerbitController.createPenerbit);
router.put('/:id', verifyToken, PenerbitController.updatePenerbit);
router.delete('/:id', verifyToken, PenerbitController.deletePenerbit);

module.exports = router;
