'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../app/lib/store/auth';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading) {
      // Public routes
      const publicRoutes = ['/', '/login', '/signup'];
      const isPublicRoute = publicRoutes.includes(pathname);

      // Redirect logic
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      } else if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show nothing while loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg-primary))]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}