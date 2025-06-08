// 'use client';

// import React, { useEffect, useState } from 'react';

// interface Oglas {
//   id: number;
//   naslov: string;
//   opis: string;
//   cijena: number;
//   lokacija: string;
//   kontakt: string;
//   kategorija: string;
// }

// export default function OglasiPrikaz() {
//   const [oglasi, setOglasi] = useState<Oglas[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8000/oglasi')
//       .then((res) => res.json())
//       .then((data) => {
//         setOglasi(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Greška pri dohvaćanju oglasa:', err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Učitavanje oglasa...</p>;

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Prikaz oglasa</h2>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
//         {oglasi.map((oglas) => (
//           <div
//             key={oglas.id}
//             style={{
//               border: '1px solid #ccc',
//               padding: '1rem',
//               borderRadius: '8px',
//               width: '250px',
//             }}
//           >
//             <h3>{oglas.naslov}</h3>
//             <p><strong>Opis:</strong> {oglas.opis}</p>
//             <p><strong>Cijena:</strong> {oglas.cijena} KM</p>
//             <p><strong>Lokacija:</strong> {oglas.lokacija}</p>
//             <p><strong>Kontakt:</strong> {oglas.kontakt}</p>
//             <p><strong>Kategorija:</strong> {oglas.kategorija}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';




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





export default function OglasiPrikaz() {
  
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [search, setSearch] = useState('');
  const [lokacija, setLokacija] = useState('');
  const [kategorija, setKategorija] = useState('');
  const [minCijena, setMinCijena] = useState('');
  const [maxCijena, setMaxCijena] = useState('');
  const [datum, setDatum] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOglasi = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lokacija) params.append("lokacija", lokacija);
    if (kategorija) params.append("kategorija", kategorija);
    if (minCijena) params.append("min_cijena", minCijena);
    if (maxCijena) params.append("max_cijena", maxCijena);
    if (datum) params.append("datum", datum);

    try {
      const res = await fetch(`http://localhost:8000/oglasi?${params.toString()}`);
      const data = await res.json();
      setOglasi(data);
    } catch (err) {
      console.error('Greška pri dohvaćanju oglasa:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOglasi();
  }, []);

  return (

    <div style={{ padding: '2rem' }}>
      <h2>Pretraga i filteri</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input placeholder="Ključna riječ" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Lokacija" value={lokacija} onChange={(e) => setLokacija(e.target.value)} />
        <input placeholder="Kategorija" value={kategorija} onChange={(e) => setKategorija(e.target.value)} />
        <input type="number" placeholder="Min cijena" value={minCijena} onChange={(e) => setMinCijena(e.target.value)} />
        <input type="number" placeholder="Max cijena" value={maxCijena} onChange={(e) => setMaxCijena(e.target.value)} />
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
        <button onClick={fetchOglasi}>Filtriraj</button>
      </div>


      <h2>Prikaz oglasa</h2>
      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        



<div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
}}>
  {oglasi.map((oglas) => (
    <Link
      key={oglas.id}
      href={`/oglas/${oglas.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          padding: '1rem',
          width: '260px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {oglas.slike && oglas.slike.length > 0 ? (
          <img
            src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
            alt="Slika oglasa"
            style={{
              width: '100%',
              height: '160px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '160px',
              backgroundColor: '#333',
              color: '#aaa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontStyle: 'italic',
              borderRadius: '8px',
              marginBottom: '10px',
            }}
          >
            Nema slike
          </div>
        )}

        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{oglas.naslov}</h3>
        <p style={{ color: '#1abc9c', fontWeight: 'bold', fontSize: '1rem' }}>{oglas.cijena} KM</p>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>{oglas.lokacija}</p>
      </div>
    </Link>
  ))}
</div>


        </div>
      )}
    </div>
  );
}
