import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';

interface AuthStatus {
  isAuthenticated: boolean;
  user: any;
}

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectAuthenticatedFromPublic?: boolean;
  redirectTo?: string;
}

/**
 * Client-side hook for authentication using server API
 * @param options - Configuration options
 * @returns Authentication status and loading state
 */
export function useServerAuth({
  requireAuth = false,
  redirectAuthenticatedFromPublic = true,
  redirectTo = PATH_AUTH.signin
}: UseAuthOptions = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        setAuthStatus(data);

        if (requireAuth && !data.isAuthenticated) {
          // Protected route, no auth - redirect to login
          router.replace(redirectTo);
          return;
        }

        // If authenticated, stay on current page (no redirect)
        if (!requireAuth && data.isAuthenticated && redirectAuthenticatedFromPublic) {
          // Do nothing, stay on current page
          setIsLoading(false);
          return;
        }

        // Check if we're on root path and should redirect to dashboard
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
          router.replace(PATH_DASHBOARD.default);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthStatus({ isAuthenticated: false, user: null });
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requireAuth, redirectAuthenticatedFromPublic, redirectTo]);

  return {
    isLoading,
    isAuthenticated: authStatus.isAuthenticated,
    user: authStatus.user
  };
}
