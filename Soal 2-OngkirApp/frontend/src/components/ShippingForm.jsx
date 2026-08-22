import { useState, useEffect } from 'react';
import { getProvinces, getCities, getDistricts } from '../services/rajaongkir';
import CourierSelector from './CourierSelector';

const BERAT_CEPAT = [
  { label: '500g', value: 500 },
  { label: '1 kg', value: 1000 },
  { label: '2 kg', value: 2000 },
  { label: '5 kg', value: 5000 },
  { label: '10 kg', value: 10000 },
];

// Hook kecil untuk mengelola alur Provinsi -> Kota -> Kecamatan
// Dipakai dua kali (Asal & Tujuan) supaya tidak duplikasi logika
function useLocationCascade() {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState('');

  // Ambil provinsi sekali saat pertama mount
  useEffect(() => {
    getProvinces()
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setProvinces(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Ambil kota setiap kali provinsi berubah
  useEffect(() => {
    setCityId('');
    setDistrictId('');
    setCities([]);
    setDistricts([]);

    if (!provinceId) return;

    setLoadingCities(true);
    getCities(provinceId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingCities(false));
  }, [provinceId]);

  // Ambil kecamatan setiap kali kota berubah
  useEffect(() => {
    setDistrictId('');
    setDistricts([]);

    if (!cityId) return;

    setLoadingDistricts(true);
    getDistricts(cityId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setDistricts(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingDistricts(false));
  }, [cityId]);

  return {
    provinces, cities, districts,
    provinceId, setProvinceId,
    cityId, setCityId,
    districtId, setDistrictId,
    loadingProvinces, loadingCities, loadingDistricts,
    error,
  };
}

function LocationSelect({ label, idPrefix, cascade }) {
  const {
    provinces, cities, districts,
    provinceId, setProvinceId,
    cityId, setCityId,
    districtId, setDistrictId,
    loadingProvinces, loadingCities, loadingDistricts,
  } = cascade;

  return (
    <div className="space-y-2">
      <label className="label" htmlFor={`${idPrefix}-province`}>{label}</label>

      <select
        id={`${idPrefix}-province`}
        className="input-base"
        value={provinceId}
        onChange={(e) => setProvinceId(e.target.value)}
        disabled={loadingProvinces}
        required
      >
        <option value="">
          {loadingProvinces ? 'Memuat provinsi...' : 'Pilih provinsi...'}
        </option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select
        id={`${idPrefix}-city`}
        className="input-base"
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        disabled={!provinceId || loadingCities}
        required
      >
        <option value="">
          {loadingCities ? 'Memuat kota...' : 'Pilih kota/kabupaten...'}
        </option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        id={`${idPrefix}-district`}
        className="input-base"
        value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}
        disabled={!cityId || loadingDistricts}
        required
      >
        <option value="">
          {loadingDistricts ? 'Memuat kecamatan...' : 'Pilih kecamatan...'}
        </option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  );
}

export default function ShippingForm({ onSubmit, isLoading }) {
  const originCascade = useLocationCascade();
  const destinationCascade = useLocationCascade();

  const [weight, setWeight]     = useState(1000);
  const [couriers, setCouriers] = useState(['jne']);

  const origin = originCascade.districtId;
  const destination = destinationCascade.districtId;

  const combinedError = originCascade.error || destinationCascade.error;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination || !weight) return;
    onSubmit({ origin, destination, weight, couriers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error lokasi */}
      {combinedError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          ⚠️ {combinedError}
        </div>
      )}

      {/* Asal & Tujuan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationSelect label="Asal" idPrefix="origin" cascade={originCascade} />
        <LocationSelect label="Tujuan" idPrefix="destination" cascade={destinationCascade} />
      </div>

      {/* Berat */}
      <div>
        <label className="label" htmlFor="weight">Berat Paket</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              id="weight"
              type="number"
              className="input-base pr-14"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min={1}
              max={30000}
              required
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              gram
            </span>
          </div>
        </div>

        {/* Tombol berat cepat */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {BERAT_CEPAT.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setWeight(value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                weight === value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pilih Kurir */}
      <CourierSelector selected={couriers} onChange={setCouriers} />

      {/* Tombol Submit */}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading || !origin || !destination}
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Menghitung...
          </>
        ) : (
          <>🔍 Cek Ongkos Kirim</>
        )}
      </button>
    </form>
  );
}