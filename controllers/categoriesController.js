const Categories = require('../models/CategoriesModel');
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');

const cache = new NodeCache();

class CategoriesController {
  static async getAllCategories(req, res) {
    try {
      const cacheKey = 'categories';
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        console.log("cached");
        res.json(cachedData);
      } else {
        const category = await Categories.findAll();
        cache.set(cacheKey, category);
        res.json(category);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async createCategory(req, res) {
    try {
      // Validate request body
      await body('category')
        .notEmpty().withMessage('Nama kategori tidak boleh kosong')
        .isString().withMessage('Nama kategori harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama kategori tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { category } = req.body;
  
      // Mendapatkan ID kategori terakhir dari database
      const getId = await Categories.findOne({ order: [['id_category', 'DESC']] });
  
      let lastId = 0;
      if (getId) {
        lastId = parseInt(getId.id_category.split('_')[1]);
      }
  
      const newId = `CTG_${(lastId + 1).toString().padStart(3, '0')}`;
      console.log("New Id = ", newId);
  
      const newCategory = await Categories.create({
        id_category: newId,
        category
      });
  
      cache.del('categories');
      res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async updateCategory(req, res) {
    try {
      // Validate request body
      await body('category')
        .notEmpty().withMessage('Nama kategori tidak boleh kosong')
        .isString().withMessage('Nama kategori harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama kategori tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const category = await Categories.findByPk(req.params.id);
      if (category) {
        await category.update(req.body);
        cache.del('categories');
        res.json(category);
      } else {
        res.status(404).json({ message: 'Category tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const category = await Categories.findByPk(req.params.id);
      if (category) {
        await category.destroy();
        cache.del('categories');
        res.json({ message: 'Category berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'Category tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = CategoriesController;
