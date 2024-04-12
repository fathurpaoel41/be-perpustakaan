const Penulises = require('../models/PenulisModel');
const NodeCache = require('node-cache');

const cache = new NodeCache();

class PenulisController {
  static async getAllPenuliss(req, res) {
    try {
      const cacheKey = 'penulis';
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        console.log("cached");
        res.json(cachedData);
      } else {
        const penulis = await Penulises.findAll();
        cache.set(cacheKey, penulis);
        res.json(penulis);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async createPenulis(req, res) {
    try {
      // Validate request body
      await body('penulis')
        .notEmpty().withMessage('Nama penulis tidak boleh kosong')
        .isString().withMessage('Nama penulis harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama penulis tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const getId = await Penulises.findOne({ order: [['id_penulis', 'DESC']] });
  
      let lastId = 0;
      if (getId) {
        lastId = parseInt(getId.id_penulis.split('_')[1]);
      }
  
      const newId = `PNS_${(lastId + 1).toString().padStart(3, '0')}`;
      console.log("New Id = ", newId);
  
      const penulis = await Penulises.create({
        id_penulis: newId,
        penulis: req.body.penulis
      });
  
      cache.del('penulis');
      res.status(201).json(penulis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
  
  static async updatePenulis(req, res) {
    try {
      // Validate request body
      await body('penulis')
        .notEmpty().withMessage('Nama penulis tidak boleh kosong')
        .isString().withMessage('Nama penulis harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama penulis tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const penulis = await Penulises.findByPk(req.params.id);
      if (penulis) {
        cache.del('penulis');
        await penulis.update(req.body);
        res.json(penulis);
      } else {
        res.status(404).json({ message: 'penulis tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async deletePenulis(req, res) {
    try {
      const penulis = await Penulises.findByPk(req.params.id);
      if (penulis) {
        cache.del('penulis');
        await penulis.destroy();
        res.json({ message: 'penulis berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'penulis tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = PenulisController;
