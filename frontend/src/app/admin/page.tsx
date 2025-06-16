'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

  interface UserType {
  id: number;
  username: string;
  email: string;
  is_Admin: boolean;
}

export default function AdminPage() {
  const { user } = useUser();
 
  const router = useRouter();

 const [users, setUsers] = useState<UserType[]>([]);
 const [adminEmails, setAdminEmails] = useState<string[]>([]);

   const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    

// useEffect(() => {
//   const fetchUsers = async () => {
//     const res = await fetch("http://localhost:8000/admin/users", {
//       headers: {
//         Authorization: `Bearer ${token}`,  // koristi JWT token iz contexta
//       },
//     });
//     const data = await res.json();
//      console.log("Svi korisnici sa servera:", data); 
//     setUsers(data);
//   };

//   if (user?.isAdmin) {
//     fetchUsers();
//   }
// }, [user]);
const [searchTerm, setSearchTerm] = useState("");

const handleSearch = async () => {
  const res = await fetch(`http://localhost:8000/admin/users?username=${searchTerm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  setUsers(data);
};


   useEffect(() => {
  const fetchData = async () => {
    const [usersRes, adminEmailsRes] = await Promise.all([
      fetch("http://localhost:8000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8000/admin/users/emails", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const usersData = await usersRes.json();
    const adminEmailsData = await adminEmailsRes.json();
    console.log("Admin emails:", adminEmailsData);

    setUsers(usersData);
    setAdminEmails(adminEmailsData);
   

  };

  if (user) {
    fetchData();
  }
}, [user]);


  if (!user || !user.isAdmin) {
    return <p className="text-white text-center mt-10">Proveravam pristup...</p>;
  }

   return (
  <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold mb-2">Dobrodošli, admin!</h1>
      <p className="text-lg">Ovde možeš pregledati sve oglase i korisničke aktivnosti.</p>
    </div>
    <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-4">
  <button
    onClick={() => router.push("/admin/kategorije")}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow"
  >
    🛠️ Upravljaj kategorijama
  </button>

  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Pretraži korisnike po username"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="p-2 rounded bg-white text-black placeholder-gray-500 border border-gray-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleSearch}
      className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded shadow"
    >
      🔍 Pretraži
    </button>

    <button
    onClick={() => router.push("/admin/statistika")}
    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded transition"
  >
    📊 Statistika
  </button>
  </div>
</div>



    <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
  {users.filter((k) => k.email !== user?.email && !adminEmails.includes(k.email))
  .map((k) => (
    
    <div
      key={k.id}
      className="bg-white text-black rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-1">
  👤 {k.username}
</h3>

      <p className="text-sm text-gray-700 mb-1">Email: {k.email}</p>
     <div className="mt-4 flex gap-x-3">
  <button
    onClick={() => router.push(`/admin/users/${k.id}`)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition transform hover:scale-105 font-semibold"
  >
    👁️ Pogledaj korisnika
  </button>
  <button
    onClick={async () => {
      const potvrdi = confirm("Da li ste sigurni da želite obrisati ovog korisnika?");
      if (!potvrdi) return;

      const token = localStorage.getItem('access_token');
      try {
        const res = await fetch(`http://localhost:8000/admin/users/${k.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert("Korisnik uspješno obrisan!");
          setUsers(users.filter((u) => u.id !== k.id));
        } else {
          alert("Greška prilikom brisanja korisnika.");
        }
      } catch (err) {
        alert("Došlo je do greške prilikom brisanja.");
      }
    }}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow-md transition transform hover:scale-105 font-semibold"
  >
    🗑️ Obriši korisnika
  </button>
</div>


    </div>
  ))}
</div>


  </div>
);

}




