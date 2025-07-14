import { ReactNode } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import AppsClientLayout from './client-layout';

type Props = {
  children: ReactNode;
};

// Server component that wraps the client layout with authentication
async function AppsLayout({ children }: Props) {
  return (
    <AuthWrapper requireAuth={true}>
      <AppsClientLayout>
        {children}
      </AppsClientLayout>
    </AuthWrapper>
  );
}

export default AppsLayout;
