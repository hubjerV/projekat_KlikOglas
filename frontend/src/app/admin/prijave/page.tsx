"use client";

import { useEffect, useState } from "react";

export default function PrijavljeniOglasiPage() {
  const [prijave, setPrijave] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:8000/prijava/sve", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.detail || "Greška");
        }
        return res.json();
      })
      .then((data) => {
        setPrijave(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Nemate pristup ili je došlo do greške.");
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prijavljeni Oglasi</h1>

      {error && <p className="text-red-500">{error}</p>}

      {prijave.length === 0 ? (
        <p>Nema prijavljenih oglasa.</p>
      ) : (
        <ul className="space-y-2">
          {prijave.map((p) => (
            <li key={p.id} className="border p-2 rounded">
              <p>
                <strong>Oglas ID:</strong> {p.oglas_id}
              </p>
              <p>
                <strong>Korisnik ID:</strong> {p.korisnik_id}
              </p>
              <p>
                <strong>Razlog:</strong> {p.razlog}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
