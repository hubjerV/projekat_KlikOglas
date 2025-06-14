/*"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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

export default function OmiljeniPage() {
  const [omiljeni, setOmiljeni] = useState<Oglas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setError("Morate biti prijavljeni da vidite omiljene oglase.");
      return;
    }
    setToken(storedToken);

    fetch("http://localhost:8000/omiljeni", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju omiljenih");
        return res.json();
      })
      .then((data) => setOmiljeni(data))
      .catch((err) => {
        console.error(err);
        setError("Greška pri učitavanju omiljenih oglasa.");
      });
  }, []);

  if (error) {
    return <div className="p-8 text-red-500 font-semibold">{error}</div>;
  }

  if (!token || omiljeni.length === 0) {
    return <div className="p-8">Nemate omiljenih oglasa.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vaši omiljeni oglasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {omiljeni.map((oglas) => (
          <div
            key={oglas.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
              alt={oglas.naslov}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{oglas.naslov}</h2>
            <p className="text-gray-600">{oglas.cijena} BAM</p>
            <Link
              href={`/oglas/${oglas.id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              Pogledaj detalje
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
*/

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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

export default function OmiljeniPage() {
  const [omiljeni, setOmiljeni] = useState<Oglas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setError("Morate biti prijavljeni da vidite omiljene oglase.");
      return;
    }
    setToken(storedToken);

    fetch("http://localhost:8000/omiljeni", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju omiljenih");
        return res.json();
      })
      .then((data) => setOmiljeni(data))
      .catch((err) => {
        console.error(err);
        setError("Greška pri učitavanju omiljenih oglasa.");
      });
  }, []);

  const ukloniIzOmiljenih = (id: number) => {
    if (!token) {
      alert("Morate biti prijavljeni da biste uklonili oglas iz omiljenih.");
      return;
    }

    fetch(`http://localhost:8000/omiljeni/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška prilikom uklanjanja oglasa");
        return res.json();
      })
      .then((data) => {
        alert(data.message); // Oglas uklonjen iz omiljenih.
        // Ažuriraj lokalno stanje tako da ukloniš obrisani oglas
        setOmiljeni((prev) => prev.filter((oglas) => oglas.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Došlo je do greške prilikom uklanjanja oglasa.");
      });
  };

  if (error) {
    return <div className="p-8 text-red-500 font-semibold">{error}</div>;
  }

  if (!token || omiljeni.length === 0) {
    return <div className="p-8">Nemate omiljenih oglasa.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vaši omiljeni oglasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {omiljeni.map((oglas) => (
          <div
            key={oglas.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
              alt={oglas.naslov}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{oglas.naslov}</h2>
            <p className="text-gray-600">{oglas.cijena} BAM</p>
            <Link
              href={`/oglas/${oglas.id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              Pogledaj detalje
            </Link>
            <button
              onClick={() => ukloniIzOmiljenih(oglas.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Ukloni iz omiljenih
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
