'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/logo.png" // mora da počne sa /
        alt="FindIt Logo"
        width={40}
        height={40}
      />
      <span className="text-white font-bold text-sm tracking-wide uppercase">FindIt</span>
    </Link>
  );
}
