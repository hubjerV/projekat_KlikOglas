'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

interface OglasType {
  id: number;
  naslov: string;
  opis: string;
  //slika_url?: string; // ako koristiš slike
  slike: string[]; // niz stringova

  cijena: number;
  lokacija: string;
  kontakt: string;
  kategorija: string;
  datum_postavljanja: string;
  broj_pregleda: number;
}


interface UserType {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

export default function UserDetail() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams();  // ID korisnika

  const [oglasi, setOglasi] = useState<OglasType[]>([]);
  const [korisnik, setKorisnik] = useState<UserType | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Dohvati podatke o korisniku
  useEffect(() => {
    const fetchKorisnik = async () => {
      const res = await fetch(`http://localhost:8000/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setKorisnik(data);
    };

    if (user?.isAdmin) {
      fetchKorisnik();
    }
  }, [id]);

  // Dohvati oglase korisnika
  useEffect(() => {
    const fetchOglasi = async () => {
      const res = await fetch(`http://localhost:8000/admin/users/${id}/oglasi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
       console.log("🔍 Oglasi koje sam dobio:", data); 
      setOglasi(data);
    };

    if (user?.isAdmin) {
      fetchOglasi();
    }
  }, [id]);

  if (!korisnik) return <p className="text-white p-4">Učitavanje korisnika...</p>;

 return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Profil korisnika: {korisnik.username}</h1>
      <p>Email: {korisnik.email}</p>
      <p>Admin: {korisnik.is_admin ? "Da" : "Ne"}</p>

      <hr className="my-4 border-gray-500" />

      <h2 className="text-2xl mb-3">Oglasi korisnika</h2>

      {oglasi.length === 0 ? (
        <p className="text-gray-300">Nema oglasa za ovog korisnika.</p>
      ) : (
        oglasi.map((oglas) => (
          <div key={oglas.id} className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              <div className="bg-gray-100 p-4">
                {oglas.slike?.length > 0 ? (
                  <img
                    src={`http://localhost:8000${oglas.slike[0]}`}
                    alt="Slika oglasa"
                    className="w-full h-64 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-300 text-gray-500">
                    Nema slike
                  </div>
                )}
              </div>

            
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{oglas.naslov}</h3>
                <p className="text-gray-600 mb-4">{oglas.opis}</p>

                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Cijena:</strong> {oglas.cijena} KM</li>
                  <li><strong>Lokacija:</strong> {oglas.lokacija}</li>
                  <li><strong>Kontakt:</strong> {oglas.kontakt}</li>
                  <li><strong>Kategorija:</strong> {oglas.kategorija}</li>
                  <li><strong>Datum postavljanja:</strong> {new Date(oglas.datum_postavljanja).toLocaleDateString()}</li>
                  <li><strong>Broj pregleda:</strong> {oglas.broj_pregleda}</li>
                </ul>

                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
                  onClick={async () => {
                    await fetch(`http://localhost:8000/admin/users/oglasi/${oglas.id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    setOglasi(oglasi.filter((o) => o.id !== oglas.id));
                  }}
                >
                  Obriši oglas
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

