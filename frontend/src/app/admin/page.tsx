'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function AdminPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!user.isAdmin) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || !user.isAdmin) {
    return <p className="text-white text-center mt-10">Proveravam pristup...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Dobrodošli, admin!</h1>
        <p className="text-lg">Ovde možeš pregledati sve oglase i korisničke aktivnosti.</p>
      </div>
    </div>
  );
}
