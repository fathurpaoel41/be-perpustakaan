const Books = require('../models/BookModel');
const { Op } = require('sequelize');
const { upload, resizeImage } = require('../config/uploadConfig');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const cache = new NodeCache();

//relasi database
const Categories = require('../models/CategoriesModel')
const Penerbit = require('../models/PenerbitModel')
const Penulis = require('../models/PenulisModel')

class BooksController {
  // Mendapatkan semua data buku
  static async getAllBooks(req, res) {
    try {
      const cacheKey = 'books';
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        // Jika data tersedia di cache, kirim data dari cache
        console.log("cached");
        res.json(cachedData);
      } else {
        // Jika data tidak tersedia di cache, ambil dari database
        const books = await Books.findAll({
          attributes: { include: ['gambar'] },
          include: [
            {
              model: Categories,
              attributes: ['category'],
              required: false //inner join
            },
            {
              model: Penerbit,
              attributes: ['penerbit'],
              required: false
            },
            {
              model: Penulis,
              attributes: ['penulis'],
              required: false
            }
          ]
           // Sertakan URL gambar dalam hasil query
        });

        const booksData = books.map(book => book.toJSON())

        // Simpan data ke cache
        cache.set(cacheKey, booksData);
        res.json(books);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

static async createBook(req, res) {
  try {
    // Validate request body
    await body('judul_buku')
      .notEmpty().withMessage('Judul buku tidak boleh kosong')
      .isString().withMessage('Judul buku harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('Judul buku tidak boleh hanya berisi spasi')
      .run(req);

    await body('isbn')
      .notEmpty().withMessage('ISBN tidak boleh kosong')
      .isString().withMessage('ISBN harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ISBN tidak boleh hanya berisi spasi')
      .run(req);

    await body('id_penerbit')
      .notEmpty().withMessage('ID penerbit tidak boleh kosong')
      .isString().withMessage('ID penerbit harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID penerbit tidak boleh hanya berisi spasi')
      .run(req);

    await body('id_penulis')
      .notEmpty().withMessage('ID penulis tidak boleh kosong')
      .isString().withMessage('ID penulis harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID penulis tidak boleh hanya berisi spasi')
      .run(req);

    await body('deskripsi')
      .notEmpty().withMessage('Deskripsi buku tidak boleh kosong')
      .isString().withMessage('Deskripsi buku harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('Deskripsi buku tidak boleh hanya berisi spasi')
      .run(req);

    await body('total_buku')
      .notEmpty().withMessage('Total buku tidak boleh kosong')
      .isNumeric().withMessage('Total buku harus berupa angka')
      .run(req);

    await body('id_categories')
      .notEmpty().withMessage('ID kategori tidak boleh kosong')
      .isString().withMessage('ID kategori harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID kategori tidak boleh hanya berisi spasi')
      .run(req);
    
    await body('gambar')
      .custom((value, { req }) => {
          console.log("file ", req.file)
          if(req.file == undefined) {
            throw new Error('File Gambar Tidak Boleh Kosong');
          }else{
            const mimeType = req.file.mimetype;
            
            if (!['image/jpeg', 'image/png','image/jpg'].includes(mimeType)) {
              throw new Error('Gambar harus berupa JPG, JPEG, atau PNG');
            }
  
            if(req.file.size >5000000){
              throw new Error('File Gambar tidak boleh lebih dari 1 MB');
            }
          }
         
          return true;
        })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { judul_buku, isbn, id_penerbit, id_penulis, deskripsi, total_buku, id_categories } = req.body;

    // Mendapatkan ID user terakhir dari database
    const getId = await Books.findOne({ order: [['id_book', 'DESC']] });

    let lastId = 0;
    if (getId) {
      lastId = parseInt(getId.id_book.split('_')[1]);
    }

    // Membuat ID user baru dengan format "BKU_[kodeunik]"
    const newId = `BKU_${(lastId + 1).toString().padStart(3, '0')}`;

    // Mendapatkan path gambar yang diupload
    const gambarPath = req.file ? req.file.path : null;

    const book = await Books.create({
      id_book: newId,
      judul_buku,
      isbn,
      id_penerbit,
      id_penulis,
      deskripsi,
      total_buku,
      id_categories,
      gambar: gambarPath // Menyimpan path gambar ke dalam database
    });

    cache.del('books');
    cache.del('filter_book');

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

static async updateBook(req, res) {
    try {
      // Validate request body
      await body('judul_buku')
        .notEmpty().withMessage('Judul buku tidak boleh kosong')
        .isString().withMessage('Judul buku harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Judul buku tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('isbn')
        .notEmpty().withMessage('ISBN tidak boleh kosong')
        .isString().withMessage('ISBN harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('ISBN tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('id_penerbit')
        .notEmpty().withMessage('ID penerbit tidak boleh kosong')
        .isString().withMessage('ID penerbit harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('ID penerbit tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('id_penulis')
        .notEmpty().withMessage('ID penulis tidak boleh kosong')
        .isString().withMessage('ID penulis harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('ID penulis tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('deskripsi')
        .notEmpty().withMessage('Deskripsi buku tidak boleh kosong')
        .isString().withMessage('Deskripsi buku harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Deskripsi buku tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('total_buku')
        .notEmpty().withMessage('Total buku tidak boleh kosong')
        .isNumeric().withMessage('Total buku harus berupa angka')
        .run(req);
  
      await body('id_categories')
        .notEmpty().withMessage('ID kategori tidak boleh kosong')
        .isString().withMessage('ID kategori harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('ID kategori tidak boleh hanya berisi spasi')
        .run(req);
      
      await body('gambar')
        .custom((value, { req }) => {
            if(req.file == undefined) {
              throw new Error('File Gambar Tidak Boleh Kosong');
            }else{
              const mimeType = req.file.mimetype;
              
              if (!['image/jpeg', 'image/png','image/jpg'].includes(mimeType)) {
                throw new Error('Gambar harus berupa JPG, JPEG, atau PNG');
              }
    
              if(req.file.size >5000000){
                throw new Error('File Gambar tidak boleh lebih dari 1 MB');
              }
            }
          
            return true;
          })
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const book = await Books.findByPk(req.params.id);
      const getExistPathGambar = book
      const { judul_buku, isbn, id_penerbit, id_penulis, deskripsi, total_buku, id_categories } = req.body;
  
      if (book) {
        const oldImagePath = book.gambar;
        const gambarPath = req.file ? req.file.path : null;
        if(oldImagePath != null){
          const oldImagePathWithoutHost = path.resolve(path.join(__dirname, '..', oldImagePath.replace('http://localhost:4000', '')));
          if (fs.existsSync(oldImagePathWithoutHost)) {
            try {
              await fs.promises.unlink(oldImagePathWithoutHost);
              console.log('Gambar lama berhasil dihapus');
            } catch (err) {
              console.error('Gagal menghapus gambar lama:', err);
            }
          } else {
            console.log('Gambar lama tidak ditemukan:', oldImagePathWithoutHost);
          }
        }else{
          console.log("gambar sebelumnya Null")
        }

        await book.update({ judul_buku, isbn, id_penerbit, id_penulis, deskripsi, total_buku, id_categories, gambar: gambarPath });
  
        if (req.file && book.gambar != null) {
          book.gambar = req.file.path;
          await book.save();
        }
  
        cache.del('books');
        cache.del('filter_book');
        res.json(book);
      } else {
        res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
  // Menghapus buku berdasarkan ID
  static async deleteBook(req, res) {
    try {
      const book = await Books.findByPk(req.params.id);

      if (book === "") {
        // Menghapus bagian "http://localhost:4000" dari oldImagePath
        console.log(book)
        const oldImagePathWithoutHost = book.gambar.replace('http://localhost:4000', '');

        // Menghapus gambar sebelumnya jika ada
        if (oldImagePathWithoutHost) {
          fs.unlink(path.join(__dirname, '..', oldImagePathWithoutHost), (err) => {
            if (err) {
              console.error('Gagal menghapus gambar lama:', err);
            } else {
              console.log('Gambar lama berhasil dihapus');
            }
          });
        }

        await book.destroy();
        cache.del('books');
        cache.del('filter_book');
        res.json({ message: 'Buku berhasil dihapus' });
      } 
      
      if(book){
        console.log("masuk 1")
        await book.destroy();
        cache.del('books');
        cache.del('filter_book');
        res.json({ message: 'Buku berhasil dihapus' });
      } 
      else {
        console.log("masuk 2")
        res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async filterBooks(req, res) {
    try {
      // Validate request body
      await body('id_penerbit')
        .optional({ nullable: true })
        .isString()
        .withMessage('ID penerbit harus berupa teks')
        .trim()
        .isLength({ min: 1 })
        .withMessage('ID penerbit tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('id_penulis')
        .optional({ nullable: true })
        .isString()
        .withMessage('ID penulis harus berupa teks')
        .trim()
        .isLength({ min: 1 })
        .withMessage('ID penulis tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('id_categories')
        .optional({ nullable: true })
        .isString()
        .withMessage('ID kategori harus berupa teks')
        .trim()
        .isLength({ min: 1 })
        .withMessage('ID kategori tidak boleh hanya berisi spasi')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { id_penerbit, id_penulis, id_categories } = req.body;
  
      const options = {
        where: {},
        include: [
          {
            model: Categories,
            attributes: ['id_category', 'category'],
            required: true, // Jika id_categories tersedia, lakukan inner join
          },
          {
            model: Penerbit,
            attributes: ['id_penerbit', 'penerbit'],
            required: true, // Jika id_penerbit tersedia, lakukan inner join
          },
          {
            model: Penulis,
            attributes: ['id_penulis', 'penulis'],
            required: true // Jika id_penulis tersedia, lakukan inner join
          },
        ],
      };
  
      if (id_penerbit) {
        options.where.id_penerbit = { [Op.eq]: id_penerbit };
      }
  
      if (id_penulis) {
        options.where.id_penulis = { [Op.eq]: id_penulis };
      }
  
      if (id_categories) {
        options.where.id_categories = { [Op.eq]: id_categories };
      }
  
      const cacheKey = 'filter_book';
      const cachedData = cache.get(cacheKey);
  
     
        // Jika data tidak tersedia di cache, ambil dari database
        const book = await Books.findAll({
          attributes: [
            'id_book',
            'judul_buku',
            'isbn',
            'id_penerbit',
            'id_penulis',
            'deskripsi',
            'total_buku',
            'id_categories',
            'gambar',
          ],
          ...options, // Tambahkan opsi filter
        });
  
        // Simpan data ke cache
        const booksData = book.map((book) => book.toJSON());
        cache.set(cacheKey, booksData);
  
        if (book.length === 0) {
          return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
  
        res.json(book);
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = BooksController;