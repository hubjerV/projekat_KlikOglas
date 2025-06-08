// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';




// interface Oglas {
//   id: number;
//   naslov: string;
//   opis: string;
//   cijena: number;
//   lokacija: string;
//   kontakt: string;
//   kategorija: string;
//   slike: string[];
// }




// export default function DetaljiOglasa() {
//   const params = useParams();
//   const [oglas, setOglas] = useState<Oglas | null>(null);

//   useEffect(() => {
//     const id = Array.isArray(params.id) ? params.id[0] : params.id;
//     if (!id) return;

//     fetch(`http://localhost:8000/oglasi/${id}`)
//       .then((res) => res.json())
//       .then((data) => setOglas(data))
//       .catch((err) => console.error('Greška pri dohvaćanju oglasa:', err));
//   }, [params.id]);

//   if (!oglas) return <p>Učitavanje detalja oglasa...</p>;

//   return (
//   <div className="oglas-wrapper">
//     <div className="oglas-card">
//       <h2 className="naslov">{oglas.naslov}</h2>

//       {oglas.slike.length > 0 ? (
//         <img
//           src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
//           alt="Slika oglasa"
//           className="oglas-slika"
//         />
//       ) : (
//         <p className="nema-sliku"><em>Nema slika za ovaj oglas.</em></p>
//       )}

//       <div className="oglas-info">
//         <p><strong>Opis:</strong> {oglas.opis}</p>
//         <p><strong>Cijena:</strong> {oglas.cijena} KM</p>
//         <p><strong>Lokacija:</strong> {oglas.lokacija}</p>
//         <p><strong>Kontakt:</strong> {oglas.kontakt}</p>
//         <p><strong>Kategorija:</strong> {oglas.kategorija}</p>
//       </div>

//       <Link href="/" className="nazad-link">
//         ← Nazad na oglase
//       </Link>
//     </div>
//   </div>
// );

// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// interface Oglas {
//   id: number;
//   naslov: string;
//   opis: string;
//   cijena: number;
//   lokacija: string;
//   kontakt: string;
//   kategorija: string;
//   slike: string[];
// }

// export default function DetaljiOglasa() {
//   const params = useParams();
//   const [oglas, setOglas] = useState<Oglas | null>(null);

//   useEffect(() => {
//     const id = Array.isArray(params.id) ? params.id[0] : params.id;
//     if (!id) return;

//     fetch(`http://localhost:8000/oglasi/${id}`)
//       .then((res) => res.json())
//       .then((data) => setOglas(data))
//       .catch((err) => console.error('Greška pri dohvaćanju oglasa:', err));
//   }, [params.id]);

//   if (!oglas) return <p style={{ padding: '2rem' }}>Učitavanje detalja oglasa...</p>;

//   return (
//     <div style={{
//       maxWidth: '800px',
//       margin: '2rem auto',
//       padding: '2rem',
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       boxShadow: '0 0 15px rgba(0,0,0,0.1)'
//     }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{oglas.naslov}</h2>

//       {/* Galerija slika */}
//     {oglas.slike.length > 0 ? (
//   <div style={{
//     display: 'flex',
//     overflowX: 'auto',
//     gap: '1rem',
//     paddingBottom: '1rem',
//     scrollSnapType: 'x mandatory',
//     borderBottom: '1px solid #ccc'
//   }}>
//     {oglas.slike.map((slika, index) => (
//       <img
//         key={index}
//         src={`http://localhost:8000${encodeURI(slika)}`}
//         alt={`Slika ${index + 1}`}
//         style={{
//           height: '300px',
//           width: 'auto',
//           objectFit: 'contain',
//           borderRadius: '8px',
//           flexShrink: 0,
//           scrollSnapAlign: 'center',
//           backgroundColor: '#f5f5f5',
//           boxShadow: '0 0 8px rgba(0,0,0,0.1)'
//         }}
//       />
//     ))}
//   </div>
// ) : (
//   <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Nema slika za ovaj oglas.</p>
// )}


//       {/* Opis */}
//       <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
//         <strong>Opis:</strong> {oglas.opis}
//       </p>

//       {/* Kartice */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
//         <div className="card-info"><strong>Lokacija:</strong> {oglas.lokacija}</div>
//         <div className="card-info"><strong>Kategorija:</strong> {oglas.kategorija}</div>
//         <div className="card-info"><strong>Kontakt:</strong> {oglas.kontakt}</div>
//         <div className="card-info"><strong>Cijena:</strong> {oglas.cijena} KM</div>
//       </div>

//       {/* Dugme za nazad */}
//       <div style={{ marginTop: '2rem' }}>
//         <Link href="/" style={{ color: '#0070f3' }}>← Nazad na oglase</Link>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';

// interface Oglas {
//   id: number;
//   naslov: string;
//   opis: string;
//   cijena: number;
//   lokacija: string;
//   kontakt: string;
//   kategorija: string;
//   slike: string[];
//   id_korisnika?: number; // Dodaj ako postoji u bazi
// }

// interface Message {
//   id: number;
//   sender_id: number;
//   receiver_id: number;
//   oglas_id: number;
//   content: string;
//   timestamp: string;
// }

// export default function DetaljiOglasa() {
//   const params = useParams();
//   const [oglas, setOglas] = useState<Oglas | null>(null);
//   const [poruke, setPoruke] = useState<Message[]>([]);
//   const [novaPoruka, setNovaPoruka] = useState('');

//   useEffect(() => {
//     const id = Array.isArray(params.id) ? params.id[0] : params.id;
//     if (!id) return;

//     fetch(`http://localhost:8000/oglasi/${id}`)
//       .then((res) => res.json())
//       .then((data) => setOglas(data))
//       .catch((err) => console.error('Greška pri dohvaćanju oglasa:', err));

//     fetch(`http://localhost:8000/messages/${id}`)
//       .then((res) => res.json())
//       .then((data) => setPoruke(data))
//       .catch((err) => console.error('Greška pri dohvaćanju poruka:', err));
//   }, [params.id]);

//   function handlePosaljiPoruku() {
//     if (!oglas) return;
//     const poruka = {
//       receiver_id: oglas.id_korisnika || 1, // zamijeni s pravim korisnikom
//       oglas_id: oglas.id,
//       content: novaPoruka,
//     };

//     // fetch('http://localhost:8000/messages/', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(poruka),
//     // })
//     const token = localStorage.getItem("token");

//       fetch("http://localhost:8000/messages", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token}`,
//   },
//   body: JSON.stringify(poruka), // ← ovdje šalješ validne podatke
// })


//       .then((res) => {
//         if (!res.ok) throw new Error('Neautorizovan');
//         return res.json();
//       })
//       .then((data) => {
//         setPoruke((prev) => [...prev, data]);
//         setNovaPoruka('');
//       })
//       .catch((err) => {
//         alert('Morate biti prijavljeni da biste poslali poruku!');
//         console.error(err);
//       });
//   }

//   if (!oglas) return <p style={{ padding: '2rem' }}>Učitavanje detalja oglasa...</p>;

//   return (
//     <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{oglas.naslov}</h2>

//       {oglas.slike.length > 0 ? (
//         <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', justifyContent: 'center', marginBottom: '1.5rem' }}>
//           {oglas.slike.map((slika, index) => (
//             <img
//               key={index}
//               src={`http://localhost:8000${encodeURI(slika)}`}
//               alt={`Slika ${index + 1}`}
//               style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
//             />
//           ))}
//         </div>
//       ) : (
//         <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Nema slika za ovaj oglas.</p>
//       )}

//       <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
//         <strong>Opis:</strong> {oglas.opis}
//       </p>

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
//         <div className="card-info"><strong>Lokacija:</strong> {oglas.lokacija}</div>
//         <div className="card-info"><strong>Kategorija:</strong> {oglas.kategorija}</div>
//         <div className="card-info"><strong>Kontakt:</strong> {oglas.kontakt}</div>
//         <div className="card-info"><strong>Cijena:</strong> {oglas.cijena} KM</div>
//       </div>

//       <div style={{ marginTop: '2rem' }}>
//         <h3>Poruke</h3>
//         {poruke.length === 0 ? (
//           <p>Nema poruka za ovaj oglas.</p>
//         ) : (
//           poruke.map((msg) => (
//             <div key={msg.id} style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
//               <strong>{msg.sender_id === 1 ? 'Vi' : 'Korisnik ' + msg.sender_id}:</strong> {msg.content}
//               <div style={{ fontSize: '0.8rem', color: '#777' }}>{new Date(msg.timestamp).toLocaleString()}</div>
//             </div>
//           ))
//         )}

//         <textarea
//           value={novaPoruka}
//           onChange={(e) => setNovaPoruka(e.target.value)}
//           placeholder="Unesite poruku..."
//           style={{ width: '100%', height: '80px', marginTop: '1rem' }}
//         />

//         <button onClick={handlePosaljiPoruku} style={{ marginTop: '0.5rem' }}>Pošalji</button>
//       </div>

//       <div style={{ marginTop: '2rem' }}>
//         <Link href="/" style={{ color: '#0070f3' }}>← Nazad na oglase</Link>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  id_korisnika?: number;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  oglas_id: number;
  content: string;
  timestamp: string;
}

export default function DetaljiOglasa() {
  const params = useParams();
  const [oglas, setOglas] = useState<Oglas | null>(null);
  const [poruke, setPoruke] = useState<Message[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    fetch(`http://localhost:8000/oglasi/${id}`)
      .then((res) => res.json())
      .then((data) => setOglas(data))
      .catch((err) => console.error('Greška pri dohvaćanju oglasa:', err));

    const token = localStorage.getItem("access_token");

    // fetch(`http://localhost:8000/messages/chat/${id}`, {
    //   headers: {
    //     "Authorization": `Bearer ${token}`
    //   }
    // })
    //   .then((res) => res.json())
    //   .then((data) => setPoruke(data))
    //   .catch((err) => console.error('Greška pri dohvaćanju poruka:', err));
        

  }, [params.id]);

  function handlePosaljiPoruku() {
    if (!oglas) return;
    const poruka = {
      receiver_id: oglas.id_korisnika || 1,
      oglas_id: oglas.id,
      content: novaPoruka,
    };

    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(poruka),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Neautorizovan');
        return res.json();
      })
      .then((data) => {
        setPoruke((prev) => [...prev, data]);
        setNovaPoruka('');
      })
      .catch((err) => {
        alert('Morate biti prijavljeni da biste poslali poruku!');
        console.error(err);
      });
  }

  if (!oglas) return <p style={{ padding: '2rem' }}>Učitavanje detalja oglasa...</p>;

  return (
  <div className="flex justify-center items-center min-h-screen bg-[#121212] px-4">
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full bg-[#1a1a1a] text-white p-6 rounded-xl shadow-lg">

      {/* Leva strana - Slika */}
      <div className="flex-1 flex justify-center items-center">
        {oglas.slike.length > 0 ? (
          <img
            src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
            alt="Slika oglasa"
            className="w-full max-w-md h-auto object-cover rounded-lg bg-[#2a2a2a]"
          />
        ) : (
          <p className="italic text-gray-400">Nema slike</p>
        )}
      </div>

      {/* Desna strana - Info */}
      <div className="flex-1 space-y-3">
        <h2 className="text-3xl font-bold">{oglas.naslov}</h2>
        <p className="text-gray-300"><strong>Opis:</strong> {oglas.opis}</p>
        <p className="text-gray-300"><strong>Lokacija:</strong> {oglas.lokacija}</p>
        <p className="text-gray-300"><strong>Kategorija:</strong> {oglas.kategorija}</p>
        <p className="text-gray-300"><strong>Kontakt:</strong> {oglas.kontakt}</p>
        <p className="text-[#1abc9c] font-bold text-lg"><strong>{oglas.cijena} KM</strong></p>

        <button
          onClick={() => window.location.href = `/chat/${oglas.id}`}
          className="mt-4 bg-[#e0843f] hover:bg-[#c36e2a] text-white py-2 px-4 rounded font-semibold"
        >
          💬 Otvori Chat
        </button>

        <Link href="/" className="block mt-6 text-[#1abc9c] hover:underline">
          ← Nazad na oglase
        </Link>
      </div>
    </div>
  </div>
);

}


