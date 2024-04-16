const Borrow = require('../models/BorrowingModel');
const Users = require('../models/UserModel');
const Books = require('../models/BookModel');
const { Op } = require('sequelize');
const DateFormatter = require('../config/DateFormatter');
const transporter = require('../config/nodemailer.config');
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');


const cache = new NodeCache({ stdTTL: 60 }); 

class BorrowingController {
  // Mendapatkan semua data peminjam
  static async getAllBorrowings(req, res) {
    try {
      const cacheKey = 'borrow';
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        // Jika data tersedia di cache, kirim data dari cache
        console.log("cached");
        res.json(cachedData);
      } else {
        // Jika data tidak tersedia di cache, ambil dari database
        const borrowings = await Borrow.findAll({
          include: [
            {
              model: Users,
              attributes: ['nama_user'],
              required: true //inner join
            },
            {
              model: Books,
              attributes: ['judul_buku'],
              required: true
            }
          ]
        });

        // Konversi objek Sequelize menjadi objek JavaScript biasa
        const borrowingsData = borrowings.map(borrowing => borrowing.toJSON());

        // Simpan data ke cache
        cache.set(cacheKey, borrowingsData);

        res.json(borrowingsData);
      }
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


// Membuat data baru peminjaman
static async createBorrowing(req, res) {
  try {
    // Validate request body
    await body('id_user')
      .notEmpty().withMessage('ID user tidak boleh kosong')
      .isString().withMessage('ID user harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID user tidak boleh hanya berisi spasi')
      .run(req);

    await body('id_book')
      .notEmpty().withMessage('ID buku tidak boleh kosong')
      .isString().withMessage('ID buku harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID buku tidak boleh hanya berisi spasi')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id_user, id_book, tanggal_pengembalian, status_peminjaman } = req.body;

    // Mendapatkan ID user terakhir dari database
    const getId = await Borrow.findOne({ order: [['id_borrowing', 'DESC']] });

    let lastId = 0;
    if (getId) {
      lastId = parseInt(getId.id_borrowing.split('_')[1]);
    }

    const newId = `BRW_${(lastId + 1).toString().padStart(3, '0')}`;
    const dateFormatter = new DateFormatter();
    const formattedDate = dateFormatter.generateTimeNow();

    console.log({newId})

    const borrowing = await Borrow.create({
      id_borrowing: newId,
      id_user,
      id_book,
      tanggal_peminjaman: formattedDate,
      tanggal_pengembalian,
      status_peminjaman
    });

    res.status(201).json(borrowing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// Mengupdate data peminjaman berdasarkan ID
static async updateBorrowing(req, res) {
  try {
    // Validate request body
    await body('id_user')
      .optional({ nullable: true })
      .isString().withMessage('ID user harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID user tidak boleh hanya berisi spasi')
      .run(req);

    await body('id_book')
      .optional({ nullable: true })
      .isString().withMessage('ID buku harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID buku tidak boleh hanya berisi spasi')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const borrow = await Borrow.findByPk(req.params.id);
    if (borrow) {
      await borrow.update(req.body);
      res.json(borrow);
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// Mendapatkan data peminjaman dengan filter
static async filterBorrowings(req, res) {
  try {
    // Validate request body
    await body('id_user')
      .optional({ nullable: true })
      .isString().withMessage('ID user harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID user tidak boleh hanya berisi spasi')
      .run(req);

    await body('id_book')
      .optional({ nullable: true })
      .isString().withMessage('ID buku harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('ID buku tidak boleh hanya berisi spasi')
      .run(req);

    await body('status_peminjaman')
      .optional({ nullable: true })
      .isString().withMessage('Status peminjaman harus berupa teks')
      .trim()
      .isLength({ min: 1 }).withMessage('Status peminjaman tidak boleh hanya berisi spasi')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id_user, id_book, status_peminjaman } = req.body;

    const options = {
      where: {},
      include: [
        {
          model: Users,
          attributes: ['nama_user'],
          required: true //inner join
        },
        {
          model: Books,
          attributes: ['judul_buku'],
          required: true
        }
      ]
    };

    if (id_user) {
      options.where.id_user = { [Op.eq]: id_user };
    }

    if (id_book) {
      options.where.id_book = { [Op.eq]: id_book };
    }

    if (status_peminjaman) {
      options.where.status_peminjaman = { [Op.eq]: status_peminjaman };
    }

    const cacheKey = 'filter_book';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      // Jika data tersedia di cache, kirim data dari cache
      res.json(cachedData);
    } else {
      // Jika data tidak tersedia di cache, ambil dari database
      const borrow = await Borrow.findAll(options);

      // Simpan data ke cache
      const booksData = borrow.map((book) => book.toJSON());

      cache.set(cacheKey, booksData);

      if (borrow.length === 0) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }

      res.json(borrow);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

  // Mengirim email notifikasi
  static async sendEmailNotification(req, res) {
    try {
      const mailOptions = {
        from: 'suryoatmojo631@gmail.com',
        to: req.body.email,
        subject: 'Verifikasi Email',
        html: `Peminjaman buku anda sudah melebihi batas waktu.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error saat mengirim email:', error);
        } else {
          console.log('Email verifikasi dikirim:', info.response);
        }
      });

      res.json({ message: "sukses mengirim data email" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteBorrowing(req, res) {
    try {
      const borrow = await Borrow.findByPk(req.params.id);
      if (borrow) {
        await borrow.destroy();
        cache.del('borrow');
        res.json({ message: 'Pinjaman Buku berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'Pinjaman Buku tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = BorrowingController;