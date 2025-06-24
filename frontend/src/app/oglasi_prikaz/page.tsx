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
  arhiviran: boolean;
  istaknut?: boolean; // DODATO
}

export default function OglasiPrikaz() {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [search, setSearch] = useState("");
  const [lokacija, setLokacija] = useState("");
  const [kategorija, setKategorija] = useState("");
  const [minCijena, setMinCijena] = useState("");
  const [maxCijena, setMaxCijena] = useState("");
  const [datum, setDatum] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOglasi = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (lokacija) params.append("lokacija", lokacija);
    if (kategorija) params.append("kategorija", kategorija);
    if (minCijena) params.append("min_cijena", minCijena);
    if (maxCijena) params.append("max_cijena", maxCijena);
    if (datum) params.append("datum", datum);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `http://localhost:8000/oglasi?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Greška servera: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        setOglasi([]);
      } else {
        setOglasi(data);
      }
    } catch (err: any) {
      setError(err.message || "Nepoznata greška");
      setOglasi([]);
    } finally {
      setLoading(false);
    }
  };

  const aktivirajOglas = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Niste prijavljeni.");

      const res = await fetch(
        `http://localhost:8000/admin/aktiviraj-oglas/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Greška prilikom aktiviranja oglasa.");
      }

      await fetchOglasi(); // Refetch oglasa nakon aktivacije
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  useEffect(() => {
    fetchOglasi();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pretraga i filteri</h2>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <input
          placeholder="Ključna riječ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Lokacija"
          value={lokacija}
          onChange={(e) => setLokacija(e.target.value)}
        />
        <input
          placeholder="Kategorija"
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min cijena"
          value={minCijena}
          onChange={(e) => setMinCijena(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max cijena"
          value={maxCijena}
          onChange={(e) => setMaxCijena(e.target.value)}
        />
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
        />
        <button onClick={fetchOglasi}>Filtriraj</button>
      </div>

      <h2>Prikaz oglasa</h2>

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: "red" }}>Greška: {error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {oglasi.length === 0 && <p>Nema oglasa za prikaz.</p>}
          {oglasi.map((oglas) => (
            <Link
              key={oglas.id}
              href={`/oglas/${oglas.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  padding: "1rem",
                  width: "260px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  position: "relative",
                  border: "1px solid #eee",
                }}
              >
                {oglas.arhiviran && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "crimson",
                      color: "#fff",
                      padding: "3px 6px",
                      fontSize: "0.7rem",
                      borderRadius: "6px",
                      zIndex: 10,
                    }}
                  >
                    Arhiviran
                  </div>
                )}

                {/* OVDJE JE OZNKA ZA ISTAKNUTI OGLAS */}
                {oglas.istaknut && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "#22c55e",
                      color: "#fff",
                      padding: "3px 8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      borderRadius: "6px",
                      zIndex: 10,
                    }}
                  >
                    ISTAKNUT
                  </div>
                )}

                {oglas.slike && oglas.slike.length > 0 ? (
                  <img
                    src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
                    alt="Slika oglasa"
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      backgroundColor: "#eee",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontStyle: "italic",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    Nema slike
                  </div>
                )}

                <h3
                  style={{
                    color: "#111",
                    fontSize: "1.1rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  {oglas.naslov}
                </h3>
                <p
                  style={{
                    color: "#1abc9c",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  {oglas.cijena} KM
                </p>
                <p style={{ color: "#888", fontSize: "0.8rem" }}>
                  {oglas.lokacija}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
