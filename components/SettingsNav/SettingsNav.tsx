'use client'
import { Box, NavLink, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

type SettingsNavItem = {
  label: string;
  value: string;
  href: string;
};

const navItems: SettingsNavItem[] = [
  { label: 'General Settings', value: 'general', href: '#general' },
  { label: 'Shift', value: 'shift', href: '#shift' },
  { label: 'Role', value: 'role', href: '#role' },
  { label: 'Position', value: 'position', href: '#position' },
  { label: 'Help', value: 'help', href: '#help' },
];

export interface SettingsNavProps {
  active?: string;
}

export function SettingsNav({ active = 'general' }: SettingsNavProps) {
  return (
    <Box>
      <Stack gap="0" mt="md">
        {navItems.map((item) => (
          <NavLink
            key={item.value}
            active={active === item.value}
            label={item.label}
            rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
            component="a"
            href={item.href}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default SettingsNav;
