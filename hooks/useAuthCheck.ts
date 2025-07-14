import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import { getCookie } from 'cookies-next';

/**
 * Hook for authentication checking with flexible redirection behavior
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirect to login when not authenticated
 * @param {boolean} options.redirectAuthenticatedFromPublic - If true, redirect already authenticated users from public pages
 * @param {string} options.redirectTo - Custom redirect path for unauthenticated users
 * @returns {boolean} - Whether authentication check is in progress
 */
export function useAuthCheck({
  requireAuth = false,
  redirectAuthenticatedFromPublic = true,
  redirectTo = PATH_AUTH.signin
} = {}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let authToken: string | undefined = undefined;
        if (typeof window !== 'undefined') {
          authToken = getCookie('token') as string | undefined;
      }

        const isAuthenticated = Boolean(authToken);

        if (requireAuth && !isAuthenticated) {
        // Protected route, no auth token - redirect to login
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated && redirectAuthenticatedFromPublic) {
        // Public route, user is already authenticated - stay on current route
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
      } catch (error) {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, requireAuth, redirectAuthenticatedFromPublic, redirectTo]);

  // Return whether we're still checking/redirecting
  return isChecking;
}