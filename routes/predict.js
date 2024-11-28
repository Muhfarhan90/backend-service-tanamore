const express = require('express');
const router = express.Router();
const multer = require('multer');
const { loadModel, makePrediction } = require('../service/inference');

// Middleware untuk memuat model saat server mulai berjalan
let model;
loadModel().then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded successfully');
}).catch((err) => {
  console.error('Error loading model:', err);
});

// Konfigurasi Multer untuk menyimpan file sementara
const storage = multer.memoryStorage(); // Menyimpan file di memori
const upload = multer({ storage: storage });

// Route untuk melakukan prediksi dengan menerima gambar
router.post('/', upload.single('image'), async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Model not loaded yet' });
  }

  try {
    const image = req.file; // Gambar yang diupload

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Mengubah gambar menjadi format base64
    const imageBase64 = image.buffer.toString('base64');

    // Lakukan prediksi menggunakan model
    const prediction = await makePrediction(model, imageBase64);

    // Kirimkan hasil prediksi sebagai JSON
    res.json({
      prediction: prediction
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Error processing prediction' });
  }
});

module.exports = router;
