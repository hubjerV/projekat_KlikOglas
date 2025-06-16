

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';


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
  broj_pregleda: number;

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user } = useUser();


  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    fetch(`http://localhost:8000/oglasi/${id}`)
      .then((res) => res.json())
      .then((data) => {
            setOglas(data);
            dodajUHistoriju(data); 
          })
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


  function dodajUHistoriju(oglas: Oglas) {
  const prethodni = JSON.parse(localStorage.getItem("pregledaniOglasi") || "[]") as Oglas[];

  const bezDuplikata = prethodni.filter((o) => o.id !== oglas.id);

  const novi = [oglas, ...bezDuplikata];

  const ograniceni = novi.slice(0, 5);

  localStorage.setItem("pregledaniOglasi", JSON.stringify(ograniceni));
}


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

      const obrisiOglas = async (): Promise<void> => {
        if (!oglas) return;

        const potvrda = confirm("Da li sigurno želiš da obrišeš ovaj oglas?");
        if (!potvrda) return;

        const token = localStorage.getItem("access_token");

        const res = await fetch(`http://localhost:8000/oglasi/${oglas.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          alert("Oglas je uspešno obrisan!");
          window.location.href = "/oglasi_prikaz";
        } else {
          const data = await res.json();
          alert("Greška: " + data.detail);
        }
      };

  if (!oglas) return <p className="p-8">Učitavanje detalja oglasa...</p>;

  return (
    <div>
    <div className="oglas-wrapper">
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">

    {/*Leva strana - slike */}
    <div className="oglas-levo flex flex-col gap-4 w-full md:w-1/2">
      <div className="oglas-slika bg-[#f0f0f0] flex justify-center items-center rounded">
        <img
          src={`http://localhost:8000${encodeURI(oglas.slike[selectedImageIndex])}`}
          alt={`Slika ${selectedImageIndex + 1}`}
          className="w-full h-auto object-contain max-h-[400px] transition duration-300 ease-in-out"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {oglas.slike.map((slika, index) => (
          <img
            key={index}
            src={`http://localhost:8000${encodeURI(slika)}`}
            alt={`Slika ${index + 1}`}
            className={`w-20 h-20 object-cover rounded border cursor-pointer ${
              selectedImageIndex === index ? 'border-4 border-blue-500' : 'border'
            }`}
            onClick={() => setSelectedImageIndex(index)}
          />

        ))}
      </div>
    </div>

    {/* Desna strana - info */}
    <div className="oglas-desno w-full md:w-1/2 space-y-3">
      <h1 className="naslov">{oglas.naslov}</h1>
      <p className="text-xl font-bold text-gray-800">{oglas.cijena} BAM</p>

      
      <p><strong>Opis: </strong> {oglas.opis}</p>
  <p className="text-sm text-gray-500">{oglas.broj_pregleda} pregleda</p>

      <button className="oglas-chat-btn w-full">🛒 {oglas.cijena} BAM</button>

      <button
            onClick={() => window.location.href = `/chat/${oglas.id}`}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
          >
            💬 Otvori Chat
          </button>

          <Link href="/oglasi_prikaz" className="block mt-6 text-blue-600 hover:underline">
            ← Nazad na oglase
          </Link>

          {user?.isAdmin && (
              <button
                onClick={obrisiOglas}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold"
              >
                🗑️ Obriši oglas
              </button>
            )}

    </div>
  </div>
</div>

<div className="mt-10 px-4 max-w-6xl mx-auto flex flex-col items-center justify-center">
  <div className="flex gap-4 overflow-x-auto">
    {JSON.parse(localStorage.getItem("pregledaniOglasi") || "[]")
      .filter((o: Oglas) => o.id !== oglas.id) 
      .map((oglas: Oglas) => (
        <Link
          href={`/oglas/${oglas.id}`}
          key={oglas.id}
          className="min-w-[150px] max-w-[200px] bg-white shadow rounded p-2 hover:shadow-lg transition"
        >
          <img
            src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
            alt={oglas.naslov}
            className="w-full h-24 object-cover rounded mb-2"
          />
          <p className="text-sm font-medium">{oglas.naslov}</p>
          <p className="text-xs text-gray-600">{oglas.cijena} BAM</p>
        </Link>
      ))}
  </div>
</div>
</div>
  );
}

