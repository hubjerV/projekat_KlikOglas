"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

interface Oglas {
  id: number;
  naslov: string;
  opis: string;
  cijena: number;
  lokacija: string;
  kontakt: string;
  kategorija: string;
  slike: string[];
  korisnik_id?: number;
  korisnik?: {
    username: string;
  };
  broj_pregleda: number;
  istaknut?: boolean;
  je_vlasnik?: boolean;
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
  const [novaPoruka, setNovaPoruka] = useState("");

  const [razlogPrijave, setRazlogPrijave] = useState("Neodgovarajući sadržaj");
  const [prijavaPoruka, setPrijavaPoruka] = useState("");
  const [prijavljen, setPrijavljen] = useState(false);

  const [istakniPoruka, setIstakniPoruka] = useState<string | null>(null);
  const [istakniLoading, setIstakniLoading] = useState(false);

  // Token i korisnikId
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  let korisnikId: number | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      korisnikId = Number(decoded.sub);
    } catch {
      korisnikId = null;
    }
  }

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    fetch(`http://localhost:8000/oglasi/${id}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Oglas nije pronađen");
        return res.json();
      })
      .then((data) => {
        console.log("Detalji oglasa:", data); // <-- DEBUG LOG
        setOglas(data);
        dodajUHistoriju(data);
      })
      .catch((err) => console.error("Greška pri dohvaćanju oglasa:", err));

    if (token && id) {
      fetch(`http://localhost:8000/prijava/provjera/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Greška pri provjeri prijave");
          return res.json();
        })
        .then((data: boolean) => {
          setPrijavljen(data);
        })
        .catch((err) => {
          console.error("Greška pri provjeri prijave:", err);
        });
    }
  }, [params.id, token]);

  function dodajUHistoriju(oglas: Oglas) {
    const prethodni = JSON.parse(
      localStorage.getItem("pregledaniOglasi") || "[]"
    ) as Oglas[];

    const bezDuplikata = prethodni.filter((o) => o.id !== oglas.id);
    const novi = [oglas, ...bezDuplikata];
    const ograniceni = novi.slice(0, 5);

    localStorage.setItem("pregledaniOglasi", JSON.stringify(ograniceni));
  }

  function handlePosaljiPoruku() {
    if (!oglas) return;
    if (!novaPoruka.trim()) {
      alert("Poruka ne smije biti prazna!");
      return;
    }
    const poruka = {
      receiver_id: oglas.korisnik_id || 1,
      oglas_id: oglas.id,
      content: novaPoruka,
    };

    if (!token) {
      alert("Morate biti prijavljeni da biste poslali poruku!");
      return;
    }

    fetch("http://localhost:8000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(poruka),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Neautorizovan");
        return res.json();
      })
      .then((data) => {
        setPoruke((prev) => [...prev, data]);
        setNovaPoruka("");
      })
      .catch((err) => {
        alert("Morate biti prijavljeni da biste poslali poruku!");
        console.error(err);
      });
  }

  function handleDodajOmiljeni(idOglasa: number) {
    if (!token) {
      alert("Morate biti prijavljeni da biste dodali oglas u omiljene.");
      return;
    }

    fetch("http://localhost:8000/omiljeni/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oglas_id: idOglasa }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.detail === "Oglas već postoji u omiljenim") {
            alert("Oglas se već nalazi u omiljenim");
            return;
          }
          throw new Error(
            errorData.detail || "Greška pri dodavanju u omiljene"
          );
        }
        alert("Oglas je dodat u omiljene.");
      })
      .catch((err) => {
        console.error(err);
        alert("Došlo je do greške prilikom dodavanja: " + err.message);
      });
  }

  function handlePrijaviOglas(idOglasa: number) {
    if (prijavljen) {
      setPrijavaPoruka("Već ste prijavili ovaj oglas.");
      return;
    }

    if (!token) {
      alert("Morate biti prijavljeni da biste prijavili oglas.");
      return;
    }

    fetch("http://localhost:8000/prijava/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oglas_id: idOglasa,
        razlog: razlogPrijave,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri prijavi oglasa");
        setPrijavaPoruka("Oglas je uspješno prijavljen.");
        setPrijavljen(true);
      })
      .catch((err) => {
        console.error(err);
        setPrijavaPoruka("Došlo je do greške prilikom prijave.");
      });
  }

  function handleIstakniOglas() {
    if (!oglas) return;
    if (!token) {
      alert("Morate biti prijavljeni da biste istakli oglas.");
      return;
    }
    setIstakniLoading(true);
    setIstakniPoruka(null);

    fetch(`http://localhost:8000/oglasi/istakni/${oglas.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        setIstakniLoading(false);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Greška pri isticanju oglasa");
        }
        setIstakniPoruka("Oglas je uspješno istaknut.");
        // refresh oglasa
        return fetch(`http://localhost:8000/oglasi/${oglas.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            console.log("Oglas nakon isticanja:", data); // <-- DEBUG LOG
            setOglas(data);
          });
      })
      .catch((err) => {
        setIstakniLoading(false);
        setIstakniPoruka(err.message);
      });
  }

  if (!oglas) return <p className="p-8">Učitavanje detalja oglasa...</p>;

  return (
    <div>
      <div className="oglas-wrapper">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
          <div className="oglas-levo flex flex-col gap-4 w-full md:w-1/2">
            <div className="oglas-slika bg-[#f0f0f0] flex justify-center items-center rounded">
              {oglas.slike && oglas.slike.length > 0 ? (
                <img
                  src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
                  alt="Slika oglasa"
                  className="w-full h-auto object-contain max-h-[400px]"
                />
              ) : (
                <div className="text-gray-500 py-20">Oglas nema slika</div>
              )}
            </div>

            {oglas.slike && oglas.slike.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {oglas.slike.map((slika, i) => (
                  <img
                    key={i}
                    src={`http://localhost:8000${encodeURI(slika)}`}
                    alt={`Slika ${i + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="oglas-desno w-full md:w-1/2 space-y-3">
            <h1 className="naslov text-3xl font-bold">{oglas.naslov}</h1>
            <p className="text-xl font-bold text-gray-800">
              {oglas.cijena} BAM
            </p>
            <p>
              <strong>Opis: </strong> {oglas.opis}
            </p>
            <p className="text-sm text-gray-500">
              {oglas.broj_pregleda} pregleda
            </p>
            <p className="text-sm">
              Objavio:{" "}
              <Link
                href={`/korisnik/${oglas.korisnik_id}`}
                className="text-blue-600 underline"
              >
                {oglas.korisnik?.username || "Nepoznat korisnik"}
              </Link>
            </p>

            {/* Prikaz dugmeta za isticanje samo ako je vlasnik i oglas nije već istaknut */}
            {oglas.je_vlasnik && !oglas.istaknut && (
              <button
                onClick={handleIstakniOglas}
                disabled={istakniLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4"
              >
                {istakniLoading
                  ? "Isticanje..."
                  : "Istakni svoj oglas (50 tokena)"}
              </button>
            )}

            {istakniPoruka && (
              <p
                className={`mt-2 font-semibold ${
                  istakniPoruka.includes("uspješno")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {istakniPoruka}
              </p>
            )}

            <button className="oglas-chat-btn w-full">
              🛒 {oglas.cijena} BAM
            </button>

            <button
              onClick={() => (window.location.href = `/chat/${oglas.id}`)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
            >
              💬 Otvori Chat
            </button>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => handleDodajOmiljeni(oglas.id)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded"
              >
                ⭐ Dodaj u omiljene
              </button>

              {prijavljen ? (
                <p className="text-green-600 font-semibold">
                  ✅ Već ste prijavili ovaj oglas.
                </p>
              ) : (
                <>
                  <label className="block">
                    Razlog prijave:
                    <select
                      className="block w-full mt-1 p-2 border rounded"
                      value={razlogPrijave}
                      onChange={(e) => setRazlogPrijave(e.target.value)}
                    >
                      <option value="Neodgovarajući sadržaj">
                        Neodgovarajući sadržaj
                      </option>
                      <option value="Prevara / Sumnjiv oglas">
                        Prevara / Sumnjiv oglas
                      </option>
                      <option value="Lažne informacije">
                        Lažne informacije
                      </option>
                      <option value="Drugo">Drugo</option>
                    </select>
                  </label>

                  <button
                    onClick={() => handlePrijaviOglas(oglas.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
                  >
                    🚨 Prijavi oglas
                  </button>
                </>
              )}
              {prijavaPoruka && (
                <p className="text-green-600 font-semibold">{prijavaPoruka}</p>
              )}

              <Link
                href="/oglasi_prikaz"
                className="text-blue-600 hover:underline font-medium text-center mt-2 block"
              >
                ← Nazad na oglase
              </Link>

              <Link
                href="/omiljeni"
                className="inline-block bg-green-500 hover:bg-green-600 text-white text-center px-4 py-2 rounded font-semibold mt-2"
              >
                💚 Pogledaj omiljene oglase
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
