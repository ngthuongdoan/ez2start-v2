import { Logo } from '@/components';
import { LinksGroup } from '@/components/Navigation/Links/Links';
import FirebaseUserButtonWithMenu from '@/components/UserButton/FirebaseUserButtonWithMenu';
import {
  PATH_APPS,
  PATH_DASHBOARD
} from '@/routes';
import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendar,
  IconChartBar,
  IconFileInvoice,
  IconSettings,
  IconUserCircle,
  IconUserCog,
  IconUsers,
  IconX
} from '@tabler/icons-react';
import classes from './Navigation.module.css';

const mockdata = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Default', icon: IconChartBar, link: PATH_DASHBOARD.default },
      // {
      //   label: 'Analytics',
      //   icon: IconChartInfographic,
      //   link: PATH_DASHBOARD.analytics,
      // },
      // { label: 'SaaS', icon: IconChartArcs3, link: PATH_DASHBOARD.saas },
    ],
  },
  {
    title: 'Apps',
    links: [
      { label: 'Profile', icon: IconUserCircle, link: PATH_APPS.profile },
      { label: 'Employee', icon: IconUsers, link: PATH_APPS.employee },
      { label: 'User settings', icon: IconUserCog, link: PATH_APPS['user-settings'] },
      { label: 'Settings', icon: IconSettings, link: PATH_APPS.settings },
      // { label: 'Chat', icon: IconMessages, link: PATH_APPS.chat },
      // { label: 'Projects', icon: IconBriefcase, link: PATH_APPS.projects },
      // { label: 'Orders', icon: IconListDetails, link: PATH_APPS.orders },
      {
        label: 'Invoices',
        icon: IconFileInvoice,
        link: PATH_APPS.invoices.all,
      },
      // { label: 'Tasks', icon: IconListDetails, link: PATH_APPS.tasks },
      { label: 'Calendar', icon: IconCalendar, link: PATH_APPS.calendar },
    ],
  },
];

type NavigationProps = {
  onClose: () => void;
};

const Navigation = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map((m) => (
    <Box pl={0} mb="md" key={m.title}>
      <Text
        tt="uppercase"
        size="xs"
        pl="md"
        fw={500}
        mb="sm"
        className={classes.linkHeader}
      >
        {m.title}
      </Text>
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify="space-between"
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <FirebaseUserButtonWithMenu showMenu={true} />
      </div>
    </nav>
  );
};

export default Navigation;
