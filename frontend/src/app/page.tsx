'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/atoms/Loader';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.replace(isAuthenticated ? '/products' : '/login');
  }, [loading, isAuthenticated, router]);

  return <Loader />;
}
