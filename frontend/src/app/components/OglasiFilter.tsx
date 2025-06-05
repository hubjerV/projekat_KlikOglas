'use client';

import { useState } from 'react';

type Props = {
  onFilter: (filters: {
    keyword: string;
    kategorija: string;
    lokacija: string;
    cijenaMin: number;
    cijenaMax: number;
    datum: string;
  }) => void;
};

export default function OglasiFilter({ onFilter }: Props) {
  const [keyword, setKeyword] = useState('');
  const [kategorija, setKategorija] = useState('');
  const [lokacija, setLokacija] = useState('');
  const [cijenaMin, setCijenaMin] = useState('');
  const [cijenaMax, setCijenaMax] = useState('');
  const [datum, setDatum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      keyword,
      kategorija,
      lokacija,
      cijenaMin: Number(cijenaMin),
      cijenaMax: Number(cijenaMax),
      datum,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input placeholder="Ključna riječ" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <input placeholder="Kategorija" value={kategorija} onChange={(e) => setKategorija(e.target.value)} />
      <input placeholder="Lokacija" value={lokacija} onChange={(e) => setLokacija(e.target.value)} />
      <input placeholder="Min cijena" type="number" value={cijenaMin} onChange={(e) => setCijenaMin(e.target.value)} />
      <input placeholder="Max cijena" type="number" value={cijenaMax} onChange={(e) => setCijenaMax(e.target.value)} />
      <input placeholder="Datum (YYYY-MM-DD)" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      <button type="submit">Filtriraj</button>
    </form>
  );
}
