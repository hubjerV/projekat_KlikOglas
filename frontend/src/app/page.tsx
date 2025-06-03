'use client';

import Navbar from './components/Navbar';
import Hero from '@/views/HomePage/Hero';

export default function HomePage() {
  return (
    <main>
      <Navbar
        items={[
          { href: '/', title: 'Shop' },
          { href: '/about', title: 'About' },
          { href: '/contact', title: 'Contact', outlined: true },
        ]}
      />
      <Hero />
    </main>
  );
}