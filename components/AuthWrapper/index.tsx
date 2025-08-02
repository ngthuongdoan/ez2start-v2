'use client';

import { useRouter } from 'next/navigation';
import { PATH_AUTH } from '@/routes';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from '@mantine/core';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedFromPublic?: boolean;
  redirectTo?: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  user: any;
}

export function AuthWrapper({
  children,
  requireAuth = false,
  redirectAuthenticatedFromPublic = false,
  redirectTo = PATH_AUTH.signin
}: AuthWrapperProps) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setAuthStatus(data);
        
        if (requireAuth && !data.isAuthenticated) {
          router.push(redirectTo);
          return;
        }
        
        if (redirectAuthenticatedFromPublic && data.isAuthenticated) {
          router.push('/dashboard/default'); // Redirect authenticated users away from public pages
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (requireAuth) {
          router.push(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectAuthenticatedFromPublic, redirectTo, router]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (requireAuth && !authStatus?.isAuthenticated) {
    return null; // Will redirect via useEffect
  }
  
  if (redirectAuthenticatedFromPublic && authStatus?.isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
