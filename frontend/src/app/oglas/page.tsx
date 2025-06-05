'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';




interface Oglas {
  id: number;
  naslov: string;
  opis: string;
  cijena: number;
  lokacija: string;
  kontakt: string;
  kategorija: string;
  slike: string[];
}

export default function DetaljiOglasa() {
  const params = useParams();
  const [oglas, setOglas] = useState<Oglas | null>(null);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    fetch(`http://localhost:8000/oglasi/${id}`)
      .then((res) => res.json())
      .then((data) => setOglas(data))
      .catch((err) => console.error('Greška pri dohvaćanju oglasa:', err));
  }, [params.id]);

  if (!oglas) return <p>Učitavanje detalja oglasa...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{oglas.naslov}</h2>

      {oglas.slike.length > 0 ? (
        <img
          src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
          alt="Slika oglasa"
          style={{ width: '400px', objectFit: 'contain', marginBottom: '20px' }}
        />
      ) : (
        <p><em>Nema slika za ovaj oglas.</em></p>
      )}

      <p><strong>Opis:</strong> {oglas.opis}</p>
      <p><strong>Cijena:</strong> {oglas.cijena} KM</p>
      <p><strong>Lokacija:</strong> {oglas.lokacija}</p>
      <p><strong>Kontakt:</strong> {oglas.kontakt}</p>
      <p><strong>Kategorija:</strong> {oglas.kategorija}</p>
    </div>
  );
}

