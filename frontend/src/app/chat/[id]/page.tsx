
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
//   sender_username: string;
// }

// export default function ChatPage() {
//   const { id } = useParams();
//   const [poruke, setPoruke] = useState<Message[]>([]);
//   const [novaPoruka, setNovaPoruka] = useState('');
//   const [receiverId, setReceiverId] = useState<number | null>(null);
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);



//   const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

// useEffect(() => {
//   const fetchPodaci = async () => {
//     if (!id || !token) return;

//     try {
//       // 1. Decode token
//       const decoded: any = JSON.parse(atob(token.split('.')[1]));
//       const username = decoded.sub;

//       // 2. Dohvati podatke o trenutnom korisniku
//       const resUser = await fetch(`http://localhost:8000/public/user/${username}`);
//       const userData = await resUser.json();
//       setCurrentUserId(userData.id);

//       // 3. Dohvati poruke za oglas
//       const resPoruke = await fetch(`http://localhost:8000/chat/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const porukeData = await resPoruke.json();
//       setPoruke(porukeData);

//       // 4. Dohvati oglas
//       const resOglas = await fetch(`http://localhost:8000/oglasi/${id}`);
//       const oglasData = await resOglas.json();
//       const vlasnikId = oglasData.id_korisnika;

//       if (userData.id === vlasnikId) {
//         // Ako je vlasnik, pokušaj naći klijenta iz poruka
//         const porukaOdKlijenta = porukeData.find((p: Message) => p.sender_id !== userData.id);
//         if (porukaOdKlijenta) {
//           setReceiverId(porukaOdKlijenta.sender_id);
//         } else {
//           // Ako još nema poruka od klijenta, dekodirani token daje username klijenta
//           const klijentUsername = decoded.sub;
//           const resKlijent = await fetch(`http://localhost:8000/public/user/${klijentUsername}`);
//           const klijentData = await resKlijent.json();
//           setReceiverId(klijentData.id);
//         }
//       } else {
//         // Ako je klijent, vlasnik oglasa je receiver
//         setReceiverId(vlasnikId);
//       }

//     } catch (error) {
//       console.error("❌ Greška u fetchovanju podataka:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchPodaci();
// }, [id, token]);


//   const handlePosalji = async () => {
//     if (!token || !receiverId || !novaPoruka.trim()) {
//       console.error("Token, receiver_id ili poruka nedostaje");
//       console.log(token,"\n",receiverId,"\n",novaPoruka)
//       return;
//     }
    


//     try {
//       const res = await fetch(`http://localhost:8000/messages`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           oglas_id: Number(id),
//           receiver_id: receiverId,
//           content: novaPoruka.trim(),
//         }),
//       });

//       if (!res.ok) throw new Error("Greška pri slanju poruke");

//       const data = await res.json();
//       setPoruke((prev) => [...prev, data]);
//       setNovaPoruka('');
//     } catch (err) {
//       console.error("Greška pri slanju poruke:", err);
//     }
//   };

//   if (loading) return <p style={{ padding: '2rem' }}>Učitavanje chata...</p>;

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Chat</h2>
//       <div style={{
//         maxHeight: '300px',
//         overflowY: 'auto',
//         border: '1px solid gray',
//         padding: '1rem',
//         marginBottom: '1rem'
//       }}>
//         {poruke.length === 0 ? (
//           <p style={{ fontStyle: 'italic' }}>Nema poruka za ovaj oglas.</p>
//         ) : (
//           poruke.map((msg) => (
//             <div key={msg.id} style={{ marginBottom: '1rem' }}>
//               {/* <strong>{msg.sender_id === currentUserId ? 'Ja' : msg.sender_id}:</strong> {msg.content} */}
//               <strong>{msg.sender_id === currentUserId ? 'Ja' : msg.sender_username}:</strong> {msg.content}

//               <div style={{ fontSize: '0.8rem', color: '#999' }}>
//                 {new Date(msg.timestamp).toLocaleString()}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       <textarea
//         value={novaPoruka}
//         onChange={(e) => setNovaPoruka(e.target.value)}
//         style={{ width: '100%', height: '80px' }}
//         placeholder="Unesi poruku..."
//       />
//       <button
//         onClick={handlePosalji}
//         style={{
//           marginTop: '0.5rem',
//           padding: '0.5rem 1rem',
//           backgroundColor: '#0070f3',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//         }}
//       >
//         Pošalji
//       </button>
//     </div>
//   );
// }

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  oglas_id: number;
  content: string;
  timestamp: string;
  sender_username: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const [poruke, setPoruke] = useState<Message[]>([]);
  const [novaPoruka, setNovaPoruka] = useState('');
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    const fetchPodaci = async () => {
      if (!id || !token) return;

      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        const username = decoded.sub;

        const resUser = await fetch(`http://localhost:8000/public/user/${username}`);
        const userData = await resUser.json();
        setCurrentUserId(userData.id);

        const resPoruke = await fetch(`http://localhost:8000/chat/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const porukeData = await resPoruke.json();
        setPoruke(porukeData);

        const resOglas = await fetch(`http://localhost:8000/oglasi/${id}`);
        const oglasData = await resOglas.json();
        const vlasnikId = oglasData.id_korisnika;

        if (userData.id === vlasnikId) {
          const porukaOdKlijenta = porukeData.find((p: Message) => p.sender_id !== userData.id);
          if (porukaOdKlijenta) {
            setReceiverId(porukaOdKlijenta.sender_id);
          } else {
            const resKlijent = await fetch(`http://localhost:8000/public/user/${username}`);
            const klijentData = await resKlijent.json();
            setReceiverId(klijentData.id);
          }
        } else {
          setReceiverId(vlasnikId);
        }

      } catch (error) {
        console.error("❌ Greška u fetchovanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodaci();
  }, [id, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [poruke]);

  const handlePosalji = async () => {
    if (!token || !receiverId || !novaPoruka.trim()) {
      console.error("Token, receiver_id ili poruka nedostaje");
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Chat</h2>

      <div
        ref={chatBoxRef}
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {poruke.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>Nema poruka za ovaj oglas.</p>
        ) : (
          poruke.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  backgroundColor: isOwn ? '#DCF8C6' : '#FFFFFF',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {isOwn ? 'Ja' : msg.sender_username}
                </div>
                <div>{msg.content}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px', textAlign: 'right' }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      <textarea
        value={novaPoruka}
        onChange={(e) => setNovaPoruka(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          resize: 'none',
          marginBottom: '0.5rem',
        }}
        placeholder="Unesi poruku..."
      />

      <button
        onClick={handlePosalji}
        style={{
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        Pošalji
      </button>
    </div>
  );
}
