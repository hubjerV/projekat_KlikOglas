'use client';

import { useEffect, useState } from 'react';

export default function UpravljanjeKategorijama() {
  const [kategorije, setKategorije] = useState<string[]>([]);
  const [novaKategorija, setNovaKategorija] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    const fetchKategorije = async () => {
      const res = await fetch('http://localhost:8000/admin/users/kategorije', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setKategorije(data.map((k: any) => k.naziv));
    };
    fetchKategorije();
  }, []);

  const dodajKategoriju = async () => {
    if (!novaKategorija.trim()) return;
    const res = await fetch('http://localhost:8000/admin/users/kategorije', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ naziv: novaKategorija })
    });
    if (res.ok) {
      setNovaKategorija('');
      const novi = await res.json();
      setKategorije((prev) => [...prev, novi.naziv]);
    } else {
      alert('Greška prilikom dodavanja.');
    }
  };

  const obrisiKategoriju = async (naziv: string) => {
    const potvrdi = confirm(`Obrisati kategoriju ${naziv}?`);
    if (!potvrdi) return;

    const res = await fetch(`http://localhost:8000/admin/users/kategorije/${naziv}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setKategorije((prev) => prev.filter((k) => k !== naziv));
    } else {
      alert('Greška prilikom brisanja.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">🛠️ Upravljanje kategorijama</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={novaKategorija}
          onChange={(e) => setNovaKategorija(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          placeholder="Unesi novu kategoriju"
        />
        <button onClick={dodajKategoriju} className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Dodaj
        </button>
      </div>

      <ul className="space-y-2">
        {kategorije.map((kat) => (
          <li key={kat} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span className="text-lg font-semibold">{kat}</span>
            <button
              onClick={() => obrisiKategoriju(kat)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑️ Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
