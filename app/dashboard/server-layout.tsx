import { ReactNode } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import DashboardClientLayout from './client-layout';

type Props = {
  children: ReactNode;
};

// Server component that wraps the client layout with authentication
async function DashboardLayout({ children }: Props) {
  return (
    <AuthWrapper requireAuth={true}>
      <DashboardClientLayout>
        {children}
      </DashboardClientLayout>
    </AuthWrapper>
  );
}

export default DashboardLayout;
