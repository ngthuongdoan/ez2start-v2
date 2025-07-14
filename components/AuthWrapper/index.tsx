import { redirect } from 'next/navigation';
import { getServerAuthStatus } from '@/lib/auth-server';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedFromPublic?: boolean;
  redirectTo?: string;
}

export async function AuthWrapper({
  children,
  requireAuth = false,
  redirectAuthenticatedFromPublic = true,
  redirectTo = PATH_AUTH.signin
}: AuthWrapperProps) {
  const authStatus = await getServerAuthStatus();
  if (requireAuth && !authStatus.isAuthenticated) {
    // Protected route, no auth - redirect to login
    redirect(redirectTo);
  }

  // If authenticated, do not redirect; stay on current route
  return <>{children}</>;
}

// Export a simple function to get auth status in server components
export { getServerAuthStatus };
