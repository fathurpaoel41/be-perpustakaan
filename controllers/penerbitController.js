const Penerbits = require('../models/PenerbitModel');
const NodeCache = require('node-cache');

const cache = new NodeCache();

class PenerbitController {
  static async getAllPenerbits(req, res) {
    try {
      const cacheKey = 'penerbit';
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        console.log("cached");
        res.json(cachedData);
      } else {
        const penerbit = await Penerbits.findAll();
        cache.set(cacheKey, penerbit);
        res.json(penerbit);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async createPenerbit(req, res) {
    try {
      // Validate request body
      await body('penerbit')
        .notEmpty().withMessage('Nama penerbit tidak boleh kosong')
        .isString().withMessage('Nama penerbit harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama penerbit tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const getId = await Penerbits.findOne({ order: [['id_penerbit', 'DESC']] });
  
      let lastId = 0;
      if (getId) {
        lastId = parseInt(getId.id_penerbit.split('_')[1]);
      }
  
      const newId = `PNB_${(lastId + 1).toString().padStart(3, '0')}`;
      console.log("New Id = ", newId);
  
      const penerbit = await Penerbits.create({
        id_penerbit: newId,
        penerbit: req.body.penerbit
      });
  
      cache.del('penerbit');
      res.status(201).json(penerbit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
  
  static async updatePenerbit(req, res) {
    try {
      // Validate request body
      await body('penerbit')
        .notEmpty().withMessage('Nama penerbit tidak boleh kosong')
        .isString().withMessage('Nama penerbit harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama penerbit tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const penerbit = await Penerbits.findByPk(req.params.id);
      if (penerbit) {
        cache.del('penerbit');
        await penerbit.update(req.body);
        res.json(penerbit);
      } else {
        res.status(404).json({ message: 'penerbit tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async deletePenerbit(req, res) {
    try {
      const penerbit = await Penerbits.findByPk(req.params.id);
      if (penerbit) {
        cache.del('penerbit');
        await penerbit.destroy();
        res.json({ message: 'penerbit berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'penerbit tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = PenerbitController;
