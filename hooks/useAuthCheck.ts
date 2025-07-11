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
          console.log('Auth token from cookie:', authToken ? 'Present' : 'Not found');
        }

        const isAuthenticated = Boolean(authToken);
        console.log('Is authenticated:', isAuthenticated);

        if (requireAuth && !isAuthenticated) {
        // Protected route, no auth token - redirect to login
          console.log('Redirecting to login - no auth token');
          router.replace(redirectTo);
        } else if (!requireAuth && isAuthenticated && redirectAuthenticatedFromPublic) {
          // Public route, user is already authenticated - redirect to dashboard
          console.log('Redirecting to dashboard - user already authenticated');
          router.replace(PATH_DASHBOARD.default);
        } else {
          // Authentication status matches route requirements, continue rendering
          if (router && typeof window !== 'undefined' && window.location.pathname === '/') {
            console.log('Redirecting from root to dashboard');
            router.replace(PATH_DASHBOARD.default);
          } else {
            console.log('Authentication check complete - allowing access');
            setIsChecking(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, requireAuth, redirectAuthenticatedFromPublic, redirectTo]);

  // Return whether we're still checking/redirecting
  return isChecking;
}