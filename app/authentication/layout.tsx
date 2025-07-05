import React, { ReactNode } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <AuthWrapper requireAuth={false} redirectAuthenticatedFromPublic={true}>
      {children}
    </AuthWrapper>
  );
}

export default AuthLayout;
