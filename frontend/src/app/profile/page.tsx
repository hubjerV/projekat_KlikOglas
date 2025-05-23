'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import error from 'next/error';

export default function ProfilePage() {
  const { user, setUser} = useUser();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setUsername(user.username); 
      setEmail(user.email || "");      
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    if (!token) {
      setMessage("Niste prijavljeni.");
      return;
    }

    const res = await fetch('http://localhost:8000/auth/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        email,
        ...(password ? { password } : {}),
      }),
    });

    console.log('Status:', res.status);
    const responseBody = await res.json().catch(() => ({}));
    console.log('Odgovor:', responseBody);

    if (res.ok) {
      // responseBody već sadrži odgovor, koristi njega!
      setUser({ username: responseBody.username, email: responseBody.email });
      setMessage("Podaci su uspešno sačuvani!");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setMessage(responseBody.detail || "Došlo je do greške.");
    }
  }

  if (!user) return null; 
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Uredi profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Korisničko ime</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Nova lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Sačuvaj promene
        </button>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}
