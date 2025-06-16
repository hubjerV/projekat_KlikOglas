'use client';

import { useEffect, useState } from "react";



import BarChartClient from '../../components/BarChartClient';




export default function StatistikaPage() {
  const [stats, setStats] = useState<{
    broj_korisnika: number;
    broj_oglasa: number;
    ukupno_pregleda: number;
    prosjecna_posjecenost: number;
  } | null>(null);

  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);


  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setStats(data);
      const chartData = [
        { name: "Korisnici", value: data.broj_korisnika },
        { name: "Oglasi", value: data.broj_oglasa },
        { name: "Pregledi", value: data.ukupno_pregleda },
       ];
       setChartData(chartData);

      
    };

    fetchStats();
  }, []);

  if (!stats) return <p className="text-white text-center mt-10">Učitavanje statistike...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Statistika</h1>
      <div className="w-full max-w-4xl mt-6">
  <h2 className="text-2xl font-semibold text-center mb-4">Vizualni prikaz</h2>
 <div style={{ width: "100%", height: 300 }}>

/<BarChartClient data={chartData} />


</div>


</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">👥 Ukupan broj korisnika:</h2>
          <p className="text-2xl">{stats.broj_korisnika}</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">📢 Ukupan broj oglasa:</h2>
          <p className="text-2xl">{stats.broj_oglasa}</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">👁️ Ukupno pregleda:</h2>
          <p className="text-2xl">{stats.ukupno_pregleda}</p>
        </div>

        <div className="bg-white text-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">📈 Prosječna posjećenost po oglasu:</h2>
          <p className="text-2xl">{stats.prosjecna_posjecenost}</p>
        </div>
      </div>
    </div>
  );
}
