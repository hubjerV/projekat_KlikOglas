'use client';

import React from 'react';
// Ispravno:
import OglasForm from './components_postavi_oglas/OglasForm';
import OglasiPrikaz from './oglasi_prikaz/Oglasi_prikaz';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <OglasForm />

      <hr className="my-10 border-gray-300" />

      <OglasiPrikaz />
    </main>
  );
}
