'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center space-x-2 cursor-pointer">
        <Image
          src="/logo.png"
          alt="FindIt Logo"
          width={40}
          height={40}
        />
        <span className="text-white font-bold text-sm tracking-wide uppercase">FindIt</span>
      </div>
    </Link>
  );
}
