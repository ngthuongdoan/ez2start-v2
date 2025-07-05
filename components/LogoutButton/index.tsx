'use client';

import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PATH_AUTH } from '@/routes';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Redirect to signin page
      router.push(PATH_AUTH.signin);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="subtle"
      color="red"
      leftSection={<IconLogout size={16} />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
