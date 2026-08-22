// Komponen untuk memilih satu atau lebih kurir pengiriman

const COURIERS = [
  { id: 'jne',  label: 'JNE',  logo: '📦' },
  { id: 'tiki', label: 'TIKI', logo: '🚚' },
  { id: 'pos',  label: 'POS',  logo: '✉️' },
];

export default function CourierSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      // Jangan sampai semua kurir tidak terpilih
      if (selected.length === 1) return;
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <label className="label">Jasa Pengiriman</label>
      <div className="flex gap-2">
        {COURIERS.map(({ id, label, logo }) => {
          const aktif = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition active:scale-[0.97] ${
                aktif
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{logo}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-xs text-gray-400">
        Pilih satu atau lebih kurir untuk dibandingkan
      </p>
    </div>
  );
}
