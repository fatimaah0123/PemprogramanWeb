import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="container">
      <h1>Aplikasi Counter</h1>
      <p className="counter-value">{count}</p>
      <button onClick={handleIncrement}>Tambah</button>
    </div>
  );
}
