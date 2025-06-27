'use client';

import { useAuthCheck } from '@/hooks/useAuthCheck';
import React, { ReactNode } from 'react';
import Loading from '../loading';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  const isChecking = useAuthCheck({ requireAuth: false });
  if (isChecking) {
    return <Loading /> // Optionally, you can return a loading state here
  }
  return <>{children}</>;
}

export default AuthLayout;
