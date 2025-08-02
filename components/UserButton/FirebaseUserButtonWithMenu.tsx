'use client';

import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ReactNode, useEffect, useMemo } from 'react';
import { useUserSettingQuery } from '../UserSettingDetailForm/UserSettingDetailForm.hook';
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
  const { fetchUserData, user } = useUserSettingQuery();

  useEffect(() => {
    fetchUserData();
  }, []);

  const displayName = useMemo(() => {
    if (!user) return 'User';
    return user.displayName ||
      (user.firstName && user.lastName)
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email?.split('@')[0] || 'User';
  }, [user]);

  const avatarLetter = useMemo(() => {
    return displayName.charAt(0).toUpperCase();
  }, [displayName]);

  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={user?.avatar || null} radius="xl">
          {!user?.avatar && avatarLetter}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {displayName}
          </Text>

          <Text size="xs">{user?.email}</Text>
        </div>

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  )
};

export default FirebaseUserButtonWithMenu;
