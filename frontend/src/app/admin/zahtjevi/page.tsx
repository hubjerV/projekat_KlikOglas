"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface TokenZahtjev {
  id: number;
  korisnik_id: number;
  broj_tokena: number;
  status: string;
  datum: string;
}

interface Korisnik {
  id: number;
  username: string;
  findit_tokeni: number;
}

export default function AdminTokenZahtjevi() {
  const [zahtjevi, setZahtjevi] = useState<TokenZahtjev[]>([]);
  const [korisnici, setKorisnici] = useState<Record<number, Korisnik>>({});
  const [poruka, setPoruka] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchZahtjevi = async () => {
    try {
      const res = await axios.get("http://localhost:8000/token-zahtjevi/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setZahtjevi(res.data);

      // Uzmi sve korisnike kojima pripadaju zahtjevi
      const korisnikIds = [
        ...new Set(res.data.map((z: TokenZahtjev) => z.korisnik_id)),
      ];

      const korisnikPromises = korisnikIds.map((id) =>
        axios.get(`http://localhost:8000/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const korisnikRes = await Promise.all(korisnikPromises);
      const korisnikMap: Record<number, Korisnik> = {};
      korisnikRes.forEach((r) => {
        korisnikMap[r.data.id] = r.data;
      });
      setKorisnici(korisnikMap);
    } catch (err) {
      console.error("Greška prilikom dohvata zahtjeva:", err);
    }
  };

  const obradiZahtjev = async (id: number, akcija: "odobri" | "odbij") => {
    try {
      await axios.post(
        `http://localhost:8000/token-zahtjevi/${id}/${akcija}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPoruka(
        `Zahtjev ${id} je ${akcija === "odobri" ? "odobren" : "odbijen"}.`
      );
      fetchZahtjevi(); // refresh
    } catch (err) {
      console.error("Greška:", err);
      setPoruka("Greška prilikom obrade zahtjeva.");
    }
  };

  useEffect(() => {
    fetchZahtjevi();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Zahtjevi za dopunu tokena</h1>

      {poruka && <p className="mb-4 text-blue-600">{poruka}</p>}

      {zahtjevi.length === 0 ? (
        <p>Nema zahtjeva.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Korisnik</th>
              <th className="p-2 border">Trenutno tokena</th>
              <th className="p-2 border">Traženi tokeni</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {zahtjevi.map((z) => {
              const korisnik = korisnici[z.korisnik_id];
              return (
                <tr key={z.id} className="text-center">
                  <td className="p-2 border">{z.id}</td>
                  <td className="p-2 border">
                    {korisnik?.username || "Nepoznato"}
                  </td>
                  <td className="p-2 border">
                    {korisnik?.findit_tokeni ?? "-"}
                  </td>
                  <td className="p-2 border">{z.broj_tokena}</td>
                  <td className="p-2 border">
                    {z.status === "na čekanju" ? (
                      <span className="text-yellow-600">{z.status}</span>
                    ) : z.status === "odobreno" ? (
                      <span className="text-green-600">{z.status}</span>
                    ) : (
                      <span className="text-red-600">{z.status}</span>
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    {z.status === "na čekanju" && (
                      <>
                        <button
                          onClick={() => obradiZahtjev(z.id, "odobri")}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Odobri
                        </button>
                        <button
                          onClick={() => obradiZahtjev(z.id, "odbij")}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Odbij
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
