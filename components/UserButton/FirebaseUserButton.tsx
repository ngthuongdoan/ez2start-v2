'use client';

import { ReactNode } from 'react';
import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useServerAuth } from '@/hooks/useServerAuth';
import classes from './UserButton.module.css';

type FirebaseUserButtonProps = {
  icon?: ReactNode;
  asAction?: boolean;
} & UnstyledButtonProps;

const FirebaseUserButton = ({
  icon,
  asAction,
  ...others
}: FirebaseUserButtonProps) => {
  const { user, isAuthenticated } = useServerAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={user.photoURL || null} radius="xl">
          {!user.photoURL && avatarLetter}
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
};

export default FirebaseUserButton;
