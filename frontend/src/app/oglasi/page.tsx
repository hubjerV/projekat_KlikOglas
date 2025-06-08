'use client';

import React from 'react';
import OglasForm from '../components_postavi_oglas/OglasForm';
import HeroIllustration from '../components/HeroIllustration';


export default function OglasiPage() {
  return (
<main className="relative min-h-screen bg-black text-white overflow-hidden">
  
  <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
    <HeroIllustration />
  </div>

  <div className="relative z-10 p-6">
    <OglasForm />
  </div>
</main>

  );
}
