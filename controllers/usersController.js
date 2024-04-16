const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const { Op } = require('sequelize');
const transporter = require('../config/nodemailer.config');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');


class UsersController {
  // Mendapatkan semua user
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  static async filterUsers(req, res) {
    try {
      // Validate request body
      await body('role')
        .optional({ nullable: true })
        .isString().withMessage('Role harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Role tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('ttlRange.startDate')
        .optional({ nullable: true })
        .isDate().withMessage('Tanggal awal range harus berupa tanggal yang valid')
        .run(req);
  
      await body('ttlRange.endDate')
        .optional({ nullable: true })
        .isDate().withMessage('Tanggal akhir range harus berupa tanggal yang valid')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { role, ttlRange } = req.body;
      const options = {};
  
      if (role) {
        options.where = { role: { [Op.eq]: role } };
      }
  
      if (ttlRange && ttlRange.startDate && ttlRange.endDate) {
        const startDate = new Date(ttlRange.startDate);
        const endDate = new Date(ttlRange.endDate);
  
        options.where = {
          ...options.where,
          ttl: {
            [Op.between]: [startDate, endDate]
          }
        };
      }
  
      const users = await User.findAll(options);
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
  
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async createUser(req, res) {
    try {
      // Validate request body
      await body('nama_user')
        .notEmpty().withMessage('Nama user tidak boleh kosong')
        .isString().withMessage('Nama user harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama user tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('ttl')
        .notEmpty().withMessage('Tanggal lahir tidak boleh kosong')
        .isDate().withMessage('Tanggal lahir harus berupa tanggal yang valid')
        .run(req);
  
      await body('role')
        .notEmpty().withMessage('Role tidak boleh kosong')
        .isString().withMessage('Role harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Role tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('no_telp')
        .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
        .isString().withMessage('Nomor telepon harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nomor telepon tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('alamat')
        .notEmpty().withMessage('Alamat tidak boleh kosong')
        .isString().withMessage('Alamat harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Alamat tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('email')
        .notEmpty().withMessage('Email tidak boleh kosong')
        .isEmail().withMessage('Email tidak valid')
        .run(req);
  
      await body('password')
        .notEmpty().withMessage('Password tidak boleh kosong')
        .isString().withMessage('Password harus berupa teks')
        .trim()
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { nama_user, ttl, role, no_telp, alamat, email, verifiedEmail, password } = req.body;
  
      //check email sudah ada atau belum
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
  
      // Mengenkripsi password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Membuat token verifikasi
      const verificationToken = crypto.randomBytes(20).toString('hex');
  
      // Mendapatkan ID user terakhir dari database
      const lastUser = await User.findOne({ order: [['id_user', 'DESC']] });
      let lastId = 0;
      if (lastUser) {
        lastId = parseInt(lastUser.id_user.split('_')[1]);
      }
  
      // Membuat ID user baru dengan format "USR_[kodeunik]"
      const newId = `USR_${(lastId + 1).toString().padStart(3, '0')}`;
  
      // Membuat user baru dengan password yang sudah dienkripsi dan ID user baru
      const user = await User.create({
        id_user: newId,
        nama_user,
        ttl,
        role,
        no_telp,
        alamat,
        email,
        password: hashedPassword,
        verifiedEmail: false,
        verificationToken
      });
  
      // Mengirim email verifikasi
      const verificationLink = `http://localhost:4000/users/verify/${verificationToken}`;
      const mailOptions = {
        from: 'suryoatmojo631@gmail.com',
        to: email,
        subject: 'Verifikasi Email',
        html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Verifikasi</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <img src="https://marketplace.canva.com/EAFIaptbfV8/1/0/900w/canva-biru-ilustrasi-awan-phone-wallpaper-quLnDmuoiAY.jpg" alt="Logo Perusahaan" width="200">
                    </td>
                </tr>
                <tr>
                    <td align="center" style="background-color: #ffffff; padding: 40px;">
                        <h1 style="color: #333;">Halo <b>${nama_user}</b>,</h1>
                        <p style="color: #666;">Terima kasih telah mendaftar! Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="background-color: #1a73e8; padding: 12px 24px; border-radius: 4px;">
                                    <a href="${verificationLink}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">Verifikasi Email</a>
                                </td>
                            </tr>
                        </table>
                        <p style="color: #666;">Jika Anda tidak melakukan pendaftaran, abaikan email ini.</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px; background-color: #f4f4f4; color: #999; font-size: 12px;">
                        &copy; 2023 Nama Perusahaan. All rights reserved.
                    </td>
                </tr>
            </table>
        </body>
        </html>`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error saat mengirim email:', error);
        } else {
          console.log('Email verifikasi dikirim:', info.response);
        }
      });
  
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
  
  // Mengupdate user berdasarkan ID
  static async updateUser(req, res) {
    try {
      // Validate request body
      await body('nama_user')
        .optional({ nullable: true })
        .isString().withMessage('Nama user harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nama user tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('ttl')
        .optional({ nullable: true })
        .isDate().withMessage('Tanggal lahir harus berupa tanggal yang valid')
        .run(req);
  
      await body('role')
        .optional({ nullable: true })
        .isString().withMessage('Role harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Role tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('no_telp')
        .optional({ nullable: true })
        .isString().withMessage('Nomor telepon harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Nomor telepon tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('alamat')
        .optional({ nullable: true })
        .isString().withMessage('Alamat harus berupa teks')
        .trim()
        .isLength({ min: 1 }).withMessage('Alamat tidak boleh hanya berisi spasi')
        .run(req);
  
      await body('email')
        .optional({ nullable: true })
        .isEmail().withMessage('Email tidak valid')
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.update(req.body);
        res.json(user);
      } else {
        res.status(404).json({ message: 'User tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  // Mendapatkan user berdasarkan ID
  static async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }

  // Rute untuk memverifikasi email
  static async verifyEmail(req, res) {
    try {
      const { verificationToken } = req.params;

      // Mencari pengguna dengan token verifikasi yang sesuai
      const user = await User.findOne({ where: { verificationToken } });

      if (!user) {
        return res.status(404).json({ message: 'Token verifikasi tidak valid' });
      }

      // Memperbarui status verifiedEmail menjadi true
      user.verifiedEmail = true;
      user.verificationToken = null;
      await user.save();

      res.json({ message: 'Email berhasil diverifikasi' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Menghapus user berdasarkan ID
  static async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.destroy();
        res.json({ message: 'User berhasil dihapus' });
      } else {
        res.status(404).json({ message: 'User tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
}

module.exports = UsersController;