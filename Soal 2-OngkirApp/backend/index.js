require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ongkirRoutes = require('./routes/ongkir');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Izinkan request dari frontend Vite
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ongkir', ongkirRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Ongkir proxy server berjalan' });
});

// Handler untuk route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan' });
});

// Handler error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);

  if (!process.env.RAJAONGKIR_API_KEY || process.env.RAJAONGKIR_API_KEY === 'your_api_key_here') {
    console.warn('⚠️  RAJAONGKIR_API_KEY belum diset di file .env');
  }
});
