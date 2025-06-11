'use client';

import { useState } from 'react';

export default function ChatBot() {
  const [pitanje, setPitanje] = useState('');
  const [odgovor, setOdgovor] = useState('');
  const [loading, setLoading] = useState(false);

  const posaljiPitanje = async () => {
    if (!pitanje.trim()) return;
    setLoading(true);
    setOdgovor('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: pitanje }),
    });

    const data = await res.json();
    setOdgovor(data.answer || 'Bot ne zna odgovor 😔');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-xl p-4 rounded-lg w-[300px]">
      <h2 className="font-semibold text-lg mb-2">🤖 ChatBot podrška</h2>
      <textarea
        value={pitanje}
        onChange={(e) => setPitanje(e.target.value)}
        rows={2}
        className="w-full p-2 border rounded mb-2"
        placeholder="Npr. Kako da postavim oglas?"
      />
      <button
        onClick={posaljiPitanje}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-1 rounded w-full"
      >
        {loading ? 'Čekam...' : 'Pošalji'}
      </button>
      {odgovor && (
        <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
          <strong>Bot:</strong> {odgovor}
        </div>
      )}
    </div>
  );
}
