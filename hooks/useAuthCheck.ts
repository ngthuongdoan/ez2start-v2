import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';

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
    const cookies = parseCookies();
    // Check for auth token - update the cookie name according to your auth implementation
    const authToken = cookies.authToken || cookies.session || cookies.token || cookies.access_token;
    const isAuthenticated = Boolean(authToken);

    if (requireAuth && !isAuthenticated) {
      // Protected route, no auth token - redirect to login
      router.replace(redirectTo);
    } else if (!requireAuth && isAuthenticated && redirectAuthenticatedFromPublic) {
      // Public route, user is already authenticated - redirect to dashboard
      router.replace(PATH_DASHBOARD.default);
    } else {
      // Authentication status matches route requirements, continue rendering
      if (router && typeof window !== 'undefined' && window.location.pathname === '/') {
        router.replace(PATH_DASHBOARD.default);
      }
      setIsChecking(false);
    }
  }, [router, requireAuth, redirectAuthenticatedFromPublic, redirectTo]);

  // Return whether we're still checking/redirecting
  return isChecking;
}