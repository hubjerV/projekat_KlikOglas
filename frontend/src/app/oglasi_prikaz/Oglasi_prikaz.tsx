// src/app/oglasi_prikaz/OglasiPrikaz.tsx
import React, { useEffect, useState } from 'react';

interface Oglas {
  id: number;
  naslov: string;
  opis: string;
  slike: string[];       // niz URL-ova slika
  cijena: string;
  lokacija: string;
  kontakt: string;
  kategorija: string;
}

export default function OglasiPrikaz() {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/oglasi/')
      .then(res => res.json())
      .then(data => {
        setOglasi(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Greška pri dohvatu oglasa:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Učitavanje oglasa...</p>;

  return (
    <div>
      <h2>Prikaz oglasa</h2>
      {oglasi.length === 0 ? (
        <p>Nema oglasa za prikaz.</p>
      ) : (
        oglasi.map(oglas => (
          <div key={oglas.id} style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
            <h3>{oglas.naslov}</h3>
            <p><strong>Opis:</strong> {oglas.opis}</p>
            <p><strong>Cijena:</strong> {oglas.cijena} KM</p>
            <p><strong>Lokacija:</strong> {oglas.lokacija}</p>
            <p><strong>Kontakt:</strong> {oglas.kontakt}</p>
            <p><strong>Kategorija:</strong> {oglas.kategorija}</p>

            {/* Prikaz slika */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
  {Array.isArray(oglas.slike) && oglas.slike.length > 0 ? (
    oglas.slike.map((url, idx) => (
      <img
        key={idx}
        src={url}
        alt={`Slika oglasa ${oglas.naslov} #${idx + 1}`}
        style={{ width: '150px', height: 'auto', objectFit: 'cover', borderRadius: '4px' }}
      />
    ))
  ) : (
    <p>Nema slika za ovaj oglas.</p>
  )}
</div>

          </div>
        ))
      )}
    </div>
  );
}
