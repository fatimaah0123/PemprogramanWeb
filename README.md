# PemprogramanWeb
# Rekognisi 2025 — Pemrograman Web

Kumpulan tugas mata kuliah Pemrograman Web untuk Rekognisi 2025. Repo ini berisi dua proyek terpisah yang masing-masing menjawab soal yang berbeda.

## Daftar Proyek

| No | Proyek | Deskripsi | Teknologi |
|----|--------|-----------|-----------|
| 1 | [`soal-1-counter`](./soal-1-counter) | Aplikasi counter sederhana — nilai bertambah 1 setiap tombol ditekan | React, Vite |
| 2 | [`soal-2-ongkir`](./soal-2-ongkir) | Aplikasi cek dan bandingkan ongkos kirim (JNE, TIKI, POS) menggunakan RajaOngkir API V2 | React, Vite, Tailwind CSS, Express, Axios |

## Cara Menjalankan

### Soal 1 — Aplikasi Counter

```bash
cd soal-1-counter
npm install
npm run dev
```
Buka `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

### Soal 2 — Cek Ongkos Kirim

Proyek ini terdiri dari dua bagian yang harus dijalankan bersamaan di terminal terpisah.

**Backend:**
```bash
cd soal-2-ongkir/backend
npm install
npm run dev
```
Buat file `.env` di folder `backend` berisi:
```
PORT=3001
KOMERCE_BASE_URL=https://rajaongkir.komerce.id/api/v1
RAJAONGKIR_API_KEY=isi_api_key_kamu
```

**Frontend:**
```bash
cd soal-2-ongkir/frontend
npm install
npm run dev
```
Buka `http://localhost:5173`.

## Catatan

- Data harga ongkos kirim bersumber dari [rajaongkir.com](https://rajaongkir.com), harga dapat berubah sewaktu-waktu.
- File `.env` tidak disertakan dalam repo ini (lihat `.gitignore`) karena berisi kredensial API key.

## Penulis

Syfa — Rekognisi 2025, Pemrograman Web
