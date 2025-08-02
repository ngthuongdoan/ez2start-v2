'use client';

import {
  ActionIcon,
  Breadcrumbs,
  BreadcrumbsProps,
  Button,
  Divider,
  Flex,
  Paper,
  PaperProps,
  rem,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { FilterDateMenu, Surface } from '@/components';
import { useColorScheme } from '@mantine/hooks';

type PageHeaderProps = {
  title: string;
  withActions?: boolean;
  breadcrumbItems?: any;
  invoiceAction?: boolean;
} & PaperProps;

const PageHeader = (props: PageHeaderProps) => {
  const { withActions, breadcrumbItems, title, invoiceAction, ...others } =
    props;

  return (
    <>
      <Surface
        component={Paper}
        style={{ backgroundColor: 'transparent' }}
        {...others}
      >
        {withActions ? (
          <Flex
            justify="space-between"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 'sm', sm: 4 }}
          >
            <Stack gap={4}>
              <Title order={3}>{title}</Title>
              <Text>Welcome back!</Text>
            </Stack>
            <Flex align="center" gap="sm">
              <ActionIcon variant="subtle">
                <IconRefresh size={16} />
              </ActionIcon>
              <FilterDateMenu />
            </Flex>
          </Flex>
        ) : invoiceAction ? (
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: 'row', sm: 'row' }}
            gap={{ base: 'sm', sm: 4 }}
          >
            <Stack>
                <Title order={3}>{title}</Title>
            </Stack>
            <Button leftSection={<IconPlus size={18} />}>New Invoice</Button>
          </Flex>
        ) : (
              <Stack gap="sm">
                <Title order={3}>{title}</Title>
          </Stack>
        )}
      </Surface>
      <Divider />
    </>
  );
};

export default PageHeader;
