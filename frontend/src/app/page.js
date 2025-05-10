"use client"; // Ova linija označava da komponenta koristi klijentske hook-ove

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/podaci')  // Novi endpoint
      .then(response => setData(response.data))
      .catch(error => console.error('Greška prilikom povezivanja sa backendom:', error));
  }, []);

  return (
    <div>
      <h1>FastAPI Podaci:</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Učitavanje...</p>
      )}
    </div>
  );
}
