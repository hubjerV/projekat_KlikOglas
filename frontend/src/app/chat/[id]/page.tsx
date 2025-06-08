// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// interface Message {
//   id: number;
//   sender_id: number;
//   receiver_id: number;
//   oglas_id: number;
//   content: string;
//   timestamp: string;
// }

// interface Oglas {
//   id_korisnika: number;
// }

// export default function ChatPage() {
//   const { id } = useParams();
//   const [poruke, setPoruke] = useState<Message[]>([]);
//   const [novaPoruka, setNovaPoruka] = useState('');
//   const [receiverId, setReceiverId] = useState<number | null>(null);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

//   useEffect(() => {
//   if (!token) return;

//   // 1. Dohvati poruke
//   fetch(`http://localhost:8000/chat/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => setPoruke(data))
//     .catch((err) => console.error('Greška:', err));

//   // 2. Dohvati oglas da znamo ko je vlasnik
//   fetch(`http://localhost:8000/oglasi/${id}`)
//     .then((res) => res.json())
//     .then((data) => setReceiverId(data.id_korisnika))
//     .catch((err) => console.error('Greška kod dohvata vlasnika oglasa:', err));
// }, [id]);

//   function handlePosalji() {
//   if (!token || !receiverId) {
//     console.error("Token ili receiver_id nedostaje");
//     return;
//   }

//   fetch(`http://localhost:8000/messages`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       oglas_id: Number(id),
//       receiver_id: receiverId,
//       content: novaPoruka,
//     }),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       setPoruke((prev) => [...prev, data]);
//       setNovaPoruka('');
//     })
//     .catch((err) => {
//       console.error('Greška pri slanju poruke:', err);
//     });
// }
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Chat</h2>
//       <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid gray', padding: '1rem' }}>
//         {poruke.map((msg) => (
//           <div key={msg.id}>
//             <strong>{msg.sender_id}:</strong> {msg.content}
//             <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(msg.timestamp).toLocaleString()}</div>
//           </div>
//         ))}
//       </div>
//       <textarea
//         value={novaPoruka}
//         onChange={(e) => setNovaPoruka(e.target.value)}
//         style={{ width: '100%', height: '80px', marginTop: '1rem' }}
//         placeholder="Unesi poruku..."
//       />
//       <button onClick={handlePosalji}>Pošalji</button>
//     </div>
//   );
// }
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  oglas_id: number;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const [poruke, setPoruke] = useState<Message[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    const fetchPodaci = async () => {
      if (!id || !token) return;

      try {
        // 1. Dohvati sve poruke za oglas
        const resPoruke = await fetch(`http://localhost:8000/chat/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resPoruke.ok) throw new Error("Neautorizovan pristup porukama");
        const porukeData = await resPoruke.json();
        setPoruke(porukeData);

        // 2. Dohvati oglas da dobiješ receiver_id
        const resOglas = await fetch(`http://localhost:8000/oglasi/${id}`);
        if (!resOglas.ok) throw new Error("Greška kod dohvata vlasnika oglasa");
        const oglasData = await resOglas.json();
        console.log("OGGLAS DATA", oglasData);
        setReceiverId(oglasData.id_korisnika);
      } catch (error) {
        console.error("Greška u fetchovanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodaci();
  }, [id, token]);

  const handlePosalji = async () => {
    if (!token || !receiverId || !novaPoruka.trim()) {
      console.error("Token ili receiver_id ili poruka nedostaje");
      console.log(token,"\n",receiverId,"\n",novaPoruka);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oglas_id: Number(id),
          receiver_id: receiverId,
          content: novaPoruka.trim(),
        }),
      });

      if (!res.ok) throw new Error("Greška pri slanju poruke");

      const data = await res.json();
      setPoruke((prev) => [...prev, data]);
      setNovaPoruka('');
    } catch (err) {
      console.error("Greška pri slanju poruke:", err);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Učitavanje chata...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Chat</h2>
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid gray',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        {poruke.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>Nema poruka za ovaj oglas.</p>
        ) : (
          poruke.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '1rem' }}>
              <strong>{msg.sender_id}:</strong> {msg.content}
              <div style={{ fontSize: '0.8rem', color: '#999' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      <textarea
        value={novaPoruka}
        onChange={(e) => setNovaPoruka(e.target.value)}
        style={{ width: '100%', height: '80px' }}
        placeholder="Unesi poruku..."
      />
      <button
        onClick={handlePosalji}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Pošalji
      </button>
    </div>
  );
}
