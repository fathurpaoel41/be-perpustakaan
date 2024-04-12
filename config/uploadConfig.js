const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Hanya menerima file gambar
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Hanya file gambar yang dapat diunggah'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Maksimal ukuran file 5MB
  }
});

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join('public', 'images', fileName);

    await sharp(req.file.path)
      .resize(800, 600) // Ukuran gambar yang diinginkan
      .toFormat('jpeg')
      .jpeg({ quality: 50 }) // Kualitas gambar 80%
      .toFile(filePath);

    req.file.path = filePath;
    next();
  } catch (err) {
    console.error('Gagal memproses gambar:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memproses gambar' });
  }
};

module.exports = {
  upload: multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } }),
  resizeImage
};
