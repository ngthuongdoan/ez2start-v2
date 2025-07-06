'use client';

import { ReactNode, useState } from 'react';
import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
  Menu,
  rem,
} from '@mantine/core';
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons-react';
import { useServerAuth } from '@/hooks/useServerAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { PATH_AUTH } from '@/routes';
import classes from './UserButton.module.css';

type FirebaseUserButtonWithMenuProps = {
  icon?: ReactNode;
  asAction?: boolean;
  showMenu?: boolean;
} & UnstyledButtonProps;

const FirebaseUserButtonWithMenu = ({
  icon,
  asAction,
  showMenu = false,
  ...others
}: FirebaseUserButtonWithMenuProps) => {
  const { user, isAuthenticated } = useServerAuth();
  const { profile } = useUserProfile();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Use profile data if available, fallback to user data
  const displayName = profile?.displayName || 
                     profile?.firstName && profile?.lastName 
                       ? `${profile.firstName} ${profile.lastName}`
                       : user.name || 
                         user.email?.split('@')[0] || 
                         'User';
  
  const photoURL = profile?.photoURL || user.photoURL;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push(PATH_AUTH.signin);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userButton = (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={photoURL || null} radius="xl">
          {!photoURL && avatarLetter}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {displayName}
          </Text>

          <Text size="xs">{user.email}</Text>
        </div>

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );

  if (!showMenu) {
    return userButton;
  }

  return (
    <Menu shadow="md" width={200} position="top-end">
      <Menu.Target>
        {userButton}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
        >
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FirebaseUserButtonWithMenu;
