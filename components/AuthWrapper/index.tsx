import { redirect } from 'next/navigation';
import { getServerAuthStatus } from '@/lib/auth-server';
import { PATH_AUTH } from '@/routes';

let cachedAuthStatus: null | Awaited<ReturnType<typeof getServerAuthStatus>> = null;

async function getCachedAuthStatus() {
  if (cachedAuthStatus === null) {
    cachedAuthStatus = await getServerAuthStatus();
  }
  return cachedAuthStatus;
}

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedFromPublic?: boolean;
  redirectTo?: string;
}

export async function AuthWrapper({
  children,
  requireAuth = false,
  redirectTo = PATH_AUTH.signin
}: AuthWrapperProps) {
  const authStatus = await getCachedAuthStatus();
  if (requireAuth && !authStatus.isAuthenticated) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

export { getServerAuthStatus };