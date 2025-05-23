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
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden px-4">
      <div className="absolute right-0 bottom-0 w-1/2 max-w-xl opacity-30">
        <HeroIllustration />
      </div>

      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-white text-black py-2 rounded font-bold">
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-white">{message}</p>}
      </div>
    </div>
  );
}
