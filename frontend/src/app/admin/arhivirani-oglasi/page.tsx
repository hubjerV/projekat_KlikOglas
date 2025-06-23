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
}

export default function AdminArhiviraniOglasi() {
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArhivirani = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Niste prijavljeni ili nemate pristup.");

      const res = await fetch("http://localhost:8000/admin/arhivirani-oglasi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Nemate ovlasti za pristup ovoj stranici.");
      }

      if (!res.ok) {
        throw new Error(`Greška servera: ${res.status}`);
      }

      const data = await res.json();
      setOglasi(data);
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

      // osvježi listu oglasa nakon uspješnog zahtjeva
      fetchArhivirani();
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  useEffect(() => {
    fetchArhivirani();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Arhivirani oglasi (samo za admina)</h2>

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {oglasi.length === 0 && <p>Nema arhiviranih oglasa za prikaz.</p>}
          {oglasi.map((oglas) => (
            <div
              key={oglas.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1rem",
                width: "260px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                border: "1px solid #eee",
              }}
            >
              <Link
                href={`/oglas/${oglas.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
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
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontStyle: "italic",
                    color: "gray",
                    marginTop: "0.5rem",
                  }}
                >
                  (Arhiviran oglas)
                </p>
              </Link>

              <button
                onClick={() => aktivirajOglas(oglas.id)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#1abc9c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Aktiviraj oglas
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
