# 📦 Cek Ongkir Indonesia

Aplikasi kalkulator ongkos kirim menggunakan [Raja Ongkir API](https://rajaongkir.com),
dibangun dengan **React + Vite** (frontend) dan **Express.js** (backend proxy).

---

## Struktur Proyek

```
ongkir-app/
├── backend/                 ← Proxy server Node.js
│   ├── routes/
│   │   └── ongkir.js        ← Endpoint /province, /city, /cost
│   ├── index.js             ← Entry point Express
│   ├── .env                 ← API key (jangan di-commit!)
│   └── package.json
│
├── frontend/                ← React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── CourierSelector.jsx   ← Pilih kurir
│   │   │   ├── ShippingForm.jsx      ← Form utama
│   │   │   └── ResultCard.jsx        ← Tampilan hasil
│   │   ├── services/
│   │   │   └── rajaongkir.js         ← Semua pemanggilan API
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js       ← Proxy /api → localhost:3001
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## Prasyarat

- **Node.js** v18 atau lebih baru
- **API Key Raja Ongkir** (daftar gratis di [rajaongkir.com](https://rajaongkir.com))

---

## Cara Menjalankan

### 1. Clone & masuk ke folder

```bash
git clone <repo-url>
cd ongkir-app
```

### 2. Setup Backend

```bash
cd backend
npm install

# Salin .env dan isi API key
cp .env .env.local
# Edit .env → isi RAJAONGKIR_API_KEY=xxxxxxxx

npm run dev   # Server berjalan di http://localhost:3001
```

### 3. Setup Frontend (terminal baru)

```bash
cd frontend
npm install
npm run dev   # App berjalan di http://localhost:5173
```

### 4. Buka di browser

Buka `http://localhost:5173` — pilih kota asal, tujuan, berat, kurir lalu klik **Cek Ongkos Kirim**.

---

## Kenapa Ada Backend?

Raja Ongkir memblokir request langsung dari browser (CORS policy). Backend Express
bertindak sebagai **proxy** yang meneruskan request ke Raja Ongkir menggunakan API key
yang disimpan aman di server, bukan di browser.

```
Browser → /api/ongkir/cost  →  Express (localhost:3001)  →  api.rajaongkir.com
```

---

## Endpoint Backend

| Method | Path                    | Keterangan              |
|--------|-------------------------|-------------------------|
| GET    | `/api/ongkir/province`  | Daftar semua provinsi   |
| GET    | `/api/ongkir/city`      | Daftar semua kota       |
| GET    | `/api/ongkir/city?province=11` | Kota per provinsi |
| POST   | `/api/ongkir/cost`      | Hitung ongkos kirim     |

Body POST `/cost`:
```json
{
  "origin": "501",
  "destination": "114",
  "weight": 1000,
  "courier": "jne"
}
```

---

## Kurir yang Didukung (Paket Starter)

| Kode   | Nama                |
|--------|---------------------|
| `jne`  | JNE                 |
| `tiki` | TIKI                |
| `pos`  | POS Indonesia       |

---

## Deploy ke Produksi

- **Backend**: deploy ke [Railway](https://railway.app), [Render](https://render.com), atau VPS. Set environment variable `RAJAONGKIR_API_KEY`.
- **Frontend**: deploy ke [Vercel](https://vercel.com) atau [Netlify](https://netlify.com). Update `baseURL` di `src/services/rajaongkir.js` ke URL backend production.
