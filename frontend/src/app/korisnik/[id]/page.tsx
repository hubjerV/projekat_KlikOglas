"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Ocjena {
  id: number;
  ocjena: number;
  komentar: string;
  korisnik_ocjenjivac_username: string;
}

interface Korisnik {
  id: number;
  username: string;
  email: string;
  prosjecna_ocjena: number;
}

export default function ProfilKorisnika() {
  const { id } = useParams();
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [ocjene, setOcjene] = useState<Ocjena[]>([]);
  const [ocjena, setOcjena] = useState(5);
  const [komentar, setKomentar] = useState("");
  const [mozeOcijeniti, setMozeOcijeniti] = useState(true);
  const [vecOcijenio, setVecOcijenio] = useState(false);

  const [otvoriFormu, setOtvoriFormu] = useState(false);
  const [brojTokena, setBrojTokena] = useState(50);
  const [porukaTokena, setPorukaTokena] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const korisnikUsername = token ? (jwtDecode(token) as any).username : null;
  const korisnikId = token ? (jwtDecode(token) as any).sub : null;

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8000/auth/${id}`)
      .then((res) => setKorisnik(res.data))
      .catch((err) => {
        console.error("Greška kod korisnika:", err);
        setKorisnik(null);
      });

    axios
      .get(`http://localhost:8000/ocjene/korisnik/${id}`)
      .then((res) => {
        setOcjene(res.data);

        const ocjenaOdKorisnika = res.data.find(
          (o: Ocjena) => o.korisnik_ocjenjivac_username === korisnikUsername
        );

        if (ocjenaOdKorisnika) {
          setVecOcijenio(true);
          setMozeOcijeniti(false);
        } else {
          if (korisnikId && korisnikId.toString() === id.toString()) {
            setMozeOcijeniti(false);
          } else {
            setMozeOcijeniti(true);
          }
          setVecOcijenio(false);
        }
      })
      .catch((err) => {
        console.error("Greška kod ocjena:", err);
        setOcjene([]);
        setMozeOcijeniti(false);
      });
  }, [id, korisnikUsername, korisnikId]);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8000/ocjene/`,
        {
          korisnik_id: parseInt(id as string),
          ocjena,
          komentar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOcjena(5);
      setKomentar("");
      setVecOcijenio(true);
      setMozeOcijeniti(false);

      const res = await axios.get(
        `http://localhost:8000/ocjene/korisnik/${id}`
      );
      setOcjene(res.data);
    } catch (err) {
      console.error("Greška prilikom slanja ocjene:", err);
      alert("Greška prilikom slanja ocjene.");
    }
  };

  const posaljiZahtjevZaTokene = async () => {
    try {
      await axios.post(
        "http://localhost:8000/token-zahtjevi/",
        { broj_tokena: brojTokena },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPorukaTokena("Zahtjev je uspješno poslan.");
      setOtvoriFormu(false);
    } catch (err: any) {
      setPorukaTokena(
        err?.response?.data?.detail || "Greška prilikom slanja zahtjeva."
      );
    }
  };

  const prosjecnaOcjena =
    ocjene.length > 0
      ? ocjene.reduce((sum, o) => sum + o.ocjena, 0) / ocjene.length
      : 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {korisnik ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{korisnik.username}</h1>
          <p className="text-gray-600">Email: {korisnik.email}</p>
          <p className="text-yellow-600 font-semibold">
            Prosječna ocjena: {prosjecnaOcjena.toFixed(2)}
          </p>

          {korisnikId?.toString() === id?.toString() && (
            <div className="mt-4">
              <button
                onClick={() => setOtvoriFormu(!otvoriFormu)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Dopuni tokene
              </button>

              {otvoriFormu && (
                <div className="mt-2 bg-gray-100 p-4 rounded shadow">
                  <label className="block mb-2 font-medium">
                    Pošalji zahtjev za FindItTokene
                  </label>
                  <select
                    value={brojTokena}
                    onChange={(e) => setBrojTokena(parseInt(e.target.value))}
                    className="border p-2 rounded mb-2 w-full"
                  >
                    <option value={50}>50 tokena</option>
                    <option value={100}>100 tokena</option>
                    <option value={200}>200 tokena</option>
                  </select>
                  <button
                    onClick={posaljiZahtjevZaTokene}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Pošalji
                  </button>
                </div>
              )}

              {porukaTokena && (
                <p className="mt-2 text-sm text-gray-800">{porukaTokena}</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500">Korisnik nije pronađen.</p>
      )}

      {mozeOcijeniti && !vecOcijenio && (
        <div className="my-4 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Ostavi ocjenu</h2>
          <select
            value={ocjena}
            onChange={(e) => setOcjena(parseInt(e.target.value))}
            className="border p-2 rounded mb-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tvoj komentar"
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Pošalji
          </button>
        </div>
      )}

      {vecOcijenio && (
        <div className="my-4 border-t pt-4">
          <p className="text-red-600 font-semibold">
            Već ste ocijenili ovog korisnika.
          </p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Ocjene i komentari</h2>
        {ocjene.length === 0 ? (
          <p>Nema još komentara.</p>
        ) : (
          ocjene.map((o) => (
            <div key={o.id} className="border-b py-2">
              <p className="font-semibold">{o.korisnik_ocjenjivac_username}</p>
              <p>Ocjena: {o.ocjena} / 5</p>
              <p>{o.komentar}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
