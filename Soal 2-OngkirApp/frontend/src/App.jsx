import { useState } from 'react';
import ShippingForm from './components/ShippingForm';
import ResultCard from './components/ResultCard';
import { getCost } from './services/rajaongkir';

export default function App() {
  const [results, setResults]   = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');
  const [lastQuery, setLastQuery] = useState(null);

  const handleSubmit = async ({ origin, destination, weight, couriers }) => {
    if (origin === destination) {
      setError('Kota asal dan tujuan tidak boleh sama.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    // Cek semua kurir secara paralel
    const promises = couriers.map((courier) =>
      getCost({ origin, destination, weight, courier }).catch((err) => {
        console.error(`Error ${courier}:`, err.message);
        return []; // Kembalikan array kosong jika satu kurir gagal
      })
    );

    try {
      const semuaHasil = await Promise.all(promises);
      const flat = semuaHasil.flat();

      if (flat.length === 0) {
        setError('Tidak ada data ongkos kirim. Periksa koneksi ke server atau coba kurir lain.');
      } else {
        setResults(flat);
        setLastQuery({ origin, destination, weight });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Raja Ongkir
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cek Ongkos Kirim</h1>
          <p className="mt-2 text-gray-500">
            Bandingkan harga pengiriman JNE, TIKI, dan POS ke seluruh Indonesia
          </p>
        </div>

        {/* Card utama */}
        <div className="card">
          <ShippingForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Hasil */}
          {results.length > 0 && lastQuery && (
            <ResultCard
              results={results}
              originName={lastQuery.originName}
              destName={lastQuery.destinationName}
              weight={lastQuery.weight}
            />
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Data harga dari{' '}
          <a
            href="https://rajaongkir.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            rajaongkir.com
          </a>{' '}
          · Harga dapat berubah sewaktu-waktu
        </p>
      </div>
    </div>
  );
}
