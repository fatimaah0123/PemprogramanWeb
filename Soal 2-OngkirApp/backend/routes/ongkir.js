const express = require('express');
const axios = require('axios');
const router = express.Router();

// API RajaOngkir versi lama (api.rajaongkir.com/starter) sudah dinonaktifkan
// sejak 20 Juli 2025. Sekarang pakai RajaOngkir API V2 via platform Komerce.
const RAJAONGKIR_BASE_URL =
  process.env.KOMERCE_BASE_URL || 'https://rajaongkir.komerce.id/api/v1';

// Fungsi helper untuk request ke RajaOngkir V2
const rajaongkirRequest = (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${RAJAONGKIR_BASE_URL}/${endpoint}`,
    headers: {
      key: process.env.RAJAONGKIR_API_KEY,
      'content-type': 'application/x-www-form-urlencoded',
    },
  };

  if (data) {
    config.data = new URLSearchParams(data).toString();
  }

  return axios(config);
};

// GET /api/ongkir/province — ambil semua provinsi
router.get('/province', async (req, res) => {
  try {
    const response = await rajaongkirRequest('GET', 'destination/province');
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Gagal mengambil data provinsi',
      detail: error.response?.data || error.message,
    });
  }
});

// GET /api/ongkir/city?province=id — ambil kota berdasarkan ID provinsi
// Catatan: di API baru, provinceId WAJIB diisi (jadi bagian path URL)
router.get('/city', async (req, res) => {
  try {
    const { province } = req.query;

    if (!province) {
      return res.status(400).json({
        error: 'Parameter province wajib diisi',
      });
    }

    const response = await rajaongkirRequest('GET', `destination/city/${province}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Gagal mengambil data kota',
      detail: error.response?.data || error.message,
    });
  }
});

// GET /api/ongkir/district?city=id — ambil kecamatan berdasarkan ID kota
// Endpoint BARU: diperlukan karena hitung ongkos kirim di API V2 butuh ID kecamatan, bukan ID kota
router.get('/district', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'Parameter city wajib diisi',
      });
    }

    const response = await rajaongkirRequest('GET', `destination/district/${city}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Gagal mengambil data kecamatan',
      detail: error.response?.data || error.message,
    });
  }
});

// POST /api/ongkir/cost — hitung ongkos kirim
// Catatan: origin & destination sekarang harus berupa ID KECAMATAN (district), bukan ID kota
router.post('/cost', async (req, res) => {
  const { origin, destination, weight, courier } = req.body;

  // Validasi input
  if (!origin || !destination || !weight || !courier) {
    return res.status(400).json({
      error: 'Parameter tidak lengkap',
      required: ['origin', 'destination', 'weight', 'courier'],
    });
  }

  if (parseInt(weight) < 1 || parseInt(weight) > 30000) {
    return res.status(400).json({
      error: 'Berat harus antara 1 gram sampai 30.000 gram',
    });
  }

  try {
    const response = await rajaongkirRequest('POST', 'calculate/domestic-cost', {
      origin,
      destination,
      weight,
      courier,
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Gagal menghitung ongkos kirim',
      detail: error.response?.data || error.message,
    });
  }
});

module.exports = router;