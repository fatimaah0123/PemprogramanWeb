import axios from 'axios';

const api = axios.create({
  baseURL: '/api/ongkir',
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const pesan =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      'Terjadi kesalahan jaringan. Pastikan backend server berjalan.';
    return Promise.reject(new Error(pesan));
  }
);

export const getProvinces = async () => {
  const { data } = await api.get('/province');
  return data.data;
};

export const getCities = async (provinceId) => {
  const { data } = await api.get('/city', { params: { province: provinceId } });
  return data.data;
};

export const getDistricts = async (cityId) => {
  const { data } = await api.get('/district', { params: { city: cityId } });
  return data.data;
};

export const getCost = async ({ origin, destination, weight, courier }) => {
  const { data } = await api.post('/cost', { origin, destination, weight, courier });
  const hasil = data.data || [];

  return hasil.map((item) => ({
    kurir: (item.name || item.code || '').toUpperCase(),
    layanan: item.service,
    deskripsi: item.description,
    harga: item.cost,
    etd: item.etd || '-',
  }));
};