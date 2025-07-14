import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';

/**
 * Hook for authentication checking using API route
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirect to login when not authenticated
 * @param {boolean} options.redirectAuthenticatedFromPublic - If true, redirect already authenticated users from public pages
 * @param {string} options.redirectTo - Custom redirect path for unauthenticated users
 * @returns {Object} - Authentication status and user data
 */
export function useAuthCheckAPI({
  requireAuth = false,
  redirectAuthenticatedFromPublic = true,
  redirectTo = PATH_AUTH.signin
} = {}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);

        console.log('Auth check result:', data);

        if (requireAuth && !data.isAuthenticated) {
          // Protected route, no auth token - redirect to login
          console.log('Redirecting to login - not authenticated');
          router.replace(redirectTo);
        } else if (!requireAuth && data.isAuthenticated && redirectAuthenticatedFromPublic) {
          // Public route, user is already authenticated - do NOT redirect, stay on current route
          setIsChecking(false);
        } else {
          // Authentication status matches route requirements, continue rendering
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, requireAuth, redirectAuthenticatedFromPublic, redirectTo]);

  return { isChecking, isAuthenticated, user };
}
