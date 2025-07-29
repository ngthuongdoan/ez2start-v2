'use client'
import { Box, NavLink, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import styles from './SettingsNav.module.css';

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
  onNavChange?: (section: string) => void;
}

export function SettingsNav({ active = 'general', onNavChange }: SettingsNavProps) {
  const handleNavClick = (value: string) => {
    if (onNavChange) {
      onNavChange(value);
    }

    // Scroll to the section smoothly
    const element = document.getElementById(value);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reference to the active nav item
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Scroll the active item into view when it changes
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [active]);

  return (
    <Box className={styles.container}>
      <Stack gap="0">
        {navItems.map((item) => {
          const isActive = active === item.value;
          return (
            <div
              key={item.value}
              ref={isActive ? activeItemRef : null}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.activeIndicator} />
              <NavLink
                active={isActive}
                label={item.label}
                rightSection={<IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: isActive ? 'translateX(3px)' : 'translateX(0)'
                  }}
                />}
                onClick={() => handleNavClick(item.value)}
                component="button"
              />
            </div>
          );
        })}
      </Stack>
    </Box>
  );
}

export default SettingsNav;
