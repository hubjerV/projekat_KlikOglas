'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import HeroIllustration from '../components/HeroIllustration';

export default function ProfilePage() {
  const { user, setUser } = useUser();
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
      setEmail(user.email || '');
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Niste prijavljeni.');
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

    const responseBody = await res.json().catch(() => ({}));

    if (res.ok) {
      setUser({ username: responseBody.username, email: responseBody.email });
      setMessage('Podaci su uspešno sačuvani!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setMessage(responseBody.detail || 'Došlo je do greške.');
    }
  }

  if (!user) return null;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      <div className="absolute right-0 bottom-0 w-1/2 max-w-xl opacity-20">
        <HeroIllustration />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-xl text-[#111] shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Uredi profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Korisničko ime"
            className="w-full p-2 bg-white border border-gray-400 rounded text-[#111] placeholder-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-white border border-gray-400 rounded text-[#111] placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nova lozinka (opciono)"
            className="w-full p-2 bg-white border border-gray-400 rounded text-[#111] placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#111] text-white py-2 rounded font-bold hover:bg-gray-800"
          >
            Sačuvaj promene
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
