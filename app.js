const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config;

// Menggunakan JSON body parser middleware
app.use(express.json());

// Mengimpor routes untuk prediksi
const predictRoute = require('./routes/predict');

// Gunakan route /predict untuk menangani prediksi
app.use('/api/predict', predictRoute);

// Menjalankan server di port 5000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
