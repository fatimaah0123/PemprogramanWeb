// Komponen untuk menampilkan hasil ongkos kirim dari satu atau beberapa kurir

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

const WARNA_KURIR = {
  JNE:  'bg-red-50 text-red-700 border-red-200',
  TIKI: 'bg-orange-50 text-orange-700 border-orange-200',
  POS:  'bg-purple-50 text-purple-700 border-purple-200',
};

export default function ResultCard({ results, originName, destName, weight }) {
  if (!results || results.length === 0) return null;

  const sorted  = [...results].sort((a, b) => a.harga - b.harga);
  const termurah = sorted[0].harga;

  // Ringkasan statistik
  const hargaMin = sorted[0].harga;
  const hargaMax = sorted[sorted.length - 1].harga;
  const jumlahLayanan = sorted.length;

  return (
    <div className="mt-6 space-y-4">
      {/* Header ringkasan */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
            {originName}
          </span>
          <span>→</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
            {destName}
          </span>
          <span className="text-gray-400">•</span>
          <span>{(weight / 1000).toLocaleString('id-ID')} kg</span>
        </div>

        {/* Kartu statistik */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Termurah" value={formatRupiah(hargaMin)} warna="text-green-700" />
          <StatCard label="Termahal" value={formatRupiah(hargaMax)} warna="text-gray-800" />
          <StatCard label="Layanan" value={`${jumlahLayanan} opsi`} warna="text-blue-700" />
        </div>
      </div>

      {/* Daftar layanan */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Semua pilihan pengiriman
        </p>
        {sorted.map((item, i) => {
          const isTermurah = item.harga === termurah;
          return (
            <div
              key={i}
              className={`flex items-center justify-between rounded-xl border p-4 transition ${
                isTermurah
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Badge kurir */}
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
                    WARNA_KURIR[item.kurir] || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {item.kurir}
                </span>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.layanan}
                    {isTermurah && (
                      <span className="ml-2 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Termurah
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{item.deskripsi}</p>
                  {item.etd && item.etd !== '-' && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      ⏱ Estimasi {item.etd} hari kerja
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className={`text-base font-semibold ${isTermurah ? 'text-green-700' : 'text-gray-900'}`}>
                  {formatRupiah(item.harga)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatRupiah(Math.round(item.harga / (weight / 1000)))}/kg
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, warna }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${warna}`}>{value}</p>
    </div>
  );
}
