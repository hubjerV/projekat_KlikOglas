'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroIllustration from '../components/HeroIllustration';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (res.ok) {
      setMessage('✅ Registracija uspešna! Preusmeravanje na login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      const data = await res.json();
      setMessage(`❌ ${data.detail || 'Greška pri registraciji.'}`);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden px-4">
      {/* SVG ilustracija kao pozadina */}
      <div className="absolute right-0 bottom-0 w-1/2 max-w-xl opacity-30 z-0">
        <HeroIllustration />
      </div>

      {/* Signup forma */}
      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 bg-transparent border border-gray-400 rounded text-white placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded">
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
