/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Mendapatkan semua kategori
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Membuat kategori baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Berhasil membuat kategori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 * 
 * /categories/{id}:
 *   put:
 *     summary: Memperbarui kategori
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Berhasil memperbarui kategori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   delete:
 *     summary: Menghapus kategori
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menghapus kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 * 
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id_category:
 *           type: string
 *         category:
 *           type: string
 *     CategoryInput:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 */

// Kode rute di sini