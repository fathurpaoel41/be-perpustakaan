const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/categoriesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, CategoriesController.getAllCategories);
router.post('/', verifyToken, CategoriesController.createCategory);
router.put('/:id', verifyToken, CategoriesController.updateCategory);
router.delete('/:id', verifyToken, CategoriesController.deleteCategory);

module.exports = router;
