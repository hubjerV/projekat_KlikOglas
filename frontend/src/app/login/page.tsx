'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroIllustration from '../components/HeroIllustration';
import { useUser } from '@/contexts/UserContext';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useUser();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);

      const decoded: any = jwtDecode(data.access_token);
      setUser({ username: decoded.sub, email: decoded.email });

      router.push('/');
      router.refresh();
    } else {
      setMessage('Neispravni podaci. Pokušajte ponovo.');
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#f9f9f9] overflow-hidden px-4">
      <div className="absolute right-0 bottom-0 w-1/2 max-w-xl opacity-20 pointer-events-none">
        <HeroIllustration />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-xl text-[#111] shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
