'use client';

import { useServerAuth } from '@/hooks/useServerAuth';
import { Text, Group, Avatar } from '@mantine/core';

export function UserInfo() {
  const { user, isAuthenticated } = useServerAuth();
  
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Group>
      <Avatar size="sm" radius="xl">
        {user.email?.charAt(0).toUpperCase()}
      </Avatar>
      <div>
        <Text size="sm" fw={500}>
          {user.name || user.email}
        </Text>
        <Text size="xs" c="dimmed">
          {user.email}
        </Text>
      </div>
    </Group>
  );
}
