'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Button,
  Group,
  Badge,
  Stack,
  ActionIcon,
  Anchor,
  SimpleGrid,
  Divider,
  Box
} from '@mantine/core';
import {
  IconPackage,
  IconCategory,
  IconTruck,
  IconReportAnalytics,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconPlus,
  IconEye
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';
import { PageHeader, StatsCard } from '@/components';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const quickActions = [
  {
    title: 'Products',
    description: 'Manage your product catalog',
    icon: IconPackage,
    href: PATH_APPS.inventory.products,
    color: 'blue',
    stats: { count: 245, label: 'Total Products' }
  },
  {
    title: 'Categories',
    description: 'Organize products by categories',
    icon: IconCategory,
    href: PATH_APPS.inventory.categories,
    color: 'green',
    stats: { count: 12, label: 'Categories' }
  },
  {
    title: 'Suppliers',
    description: 'Manage supplier relationships',
    icon: IconTruck,
    href: PATH_APPS.inventory.suppliers,
    color: 'orange',
    stats: { count: 18, label: 'Active Suppliers' }
  },
  {
    title: 'Stock Management',
    description: 'Track and adjust inventory levels',
    icon: IconReportAnalytics,
    href: PATH_APPS.inventory.stock,
    color: 'purple',
    stats: { count: 23, label: 'Low Stock Items' }
  }
];

const mockStats = [
  {
    title: 'Total Products',
    value: '245',
    diff: 12,
    icon: IconPackage,
    color: 'blue'
  },
  {
    title: 'Low Stock Alerts',
    value: '23',
    diff: -3,
    icon: IconAlertTriangle,
    color: 'red'
  },
  {
    title: 'Total Inventory Value',
    value: '$125,430',
    diff: 8,
    icon: IconTrendingUp,
    color: 'green'
  },
  {
    title: 'Active Suppliers',
    value: '18',
    diff: 2,
    icon: IconUsers,
    color: 'orange'
  }
];

const recentMovements = [
  {
    id: '1',
    product: 'MacBook Pro 14"',
    type: 'in',
    quantity: 10,
    date: '2025-08-02',
    supplier: 'Apple Inc.'
  },
  {
    id: '2',
    product: 'Office Chair - Ergonomic',
    type: 'out',
    quantity: 5,
    date: '2025-08-01',
    supplier: null
  },
  {
    id: '3',
    product: 'Wireless Mouse',
    type: 'in',
    quantity: 25,
    date: '2025-08-01',
    supplier: 'Logitech'
  }
];

export default function InventoryPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Inventory Management"
      />

      {/* Stats Overview */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        {mockStats.map((stat, index) => (
          <StatsCard
            p="md"
            key={index}
            data={stat}
          />
        ))}
      </SimpleGrid>

      <Grid>
        {/* Quick Actions */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>Quick Actions</Text>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  shadow="xs"
                  padding="md"
                  radius="sm"
                  withBorder
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(action.href)}
                >
                  <Group>
                    <ActionIcon
                      size="xl"
                      variant="light"
                      color={action.color}
                    >
                      <action.icon size={24} />
                    </ActionIcon>
                    <Box flex={1}>
                      <Text fw={500} size="sm">{action.title}</Text>
                      <Text size="xs" c="dimmed">{action.description}</Text>
                      <Group gap="xs" mt="xs">
                        <Text size="lg" fw={700}>{action.stats.count}</Text>
                        <Text size="xs" c="dimmed">{action.stats.label}</Text>
                      </Group>
                    </Box>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Card>
        </Grid.Col>

        {/* Recent Stock Movements */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={500}>Recent Movements</Text>
              <Button
                variant="light"
                size="xs"
                onClick={() => router.push(PATH_APPS.inventory.stock)}
              >
                View All
              </Button>
            </Group>

            <Stack gap="sm">
              {recentMovements.map((movement) => (
                <Card key={movement.id} padding="sm" radius="sm" withBorder>
                  <Group justify="space-between" align="flex-start">
                    <Box flex={1}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {movement.product}
                      </Text>
                      <Group gap="xs" mt={4}>
                        <Badge
                          size="xs"
                          color={movement.type === 'in' ? 'green' : 'red'}
                          variant="light"
                        >
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </Badge>
                        <Text size="xs" c="dimmed">{movement.date}</Text>
                      </Group>
                      {movement.supplier && (
                        <Text size="xs" c="dimmed" mt={2}>
                          {movement.supplier}
                        </Text>
                      )}
                    </Box>
                    <ActionIcon
                      size="sm"
                      variant={movement.type === 'in' ? 'light' : 'subtle'}
                      color={movement.type === 'in' ? 'green' : 'red'}
                    >
                      {movement.type === 'in' ?
                        <IconTrendingUp size={14} /> :
                        <IconTrendingDown size={14} />
                      }
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Quick Reports Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
        <Group justify="space-between" mb="md">
          <Text size="lg" fw={500}>Quick Reports</Text>
          <Button
            variant="light"
            leftSection={<IconReportAnalytics size={16} />}
            onClick={() => router.push(PATH_APPS.inventory.reports)}
          >
            View Reports
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Group>
              <ActionIcon size="lg" variant="light" color="red">
                <IconAlertTriangle size={20} />
              </ActionIcon>
              <Box>
                <Text fw={500}>Low Stock Alert</Text>
                <Text size="sm" c="dimmed">23 products need restocking</Text>
              </Box>
            </Group>
          </Card>

          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Group>
              <ActionIcon size="lg" variant="light" color="blue">
                <IconTrendingUp size={20} />
              </ActionIcon>
              <Box>
                <Text fw={500}>Top Moving Items</Text>
                <Text size="sm" c="dimmed">View best-selling products</Text>
              </Box>
            </Group>
          </Card>

          <Card shadow="xs" padding="md" radius="sm" withBorder>
            <Group>
              <ActionIcon size="lg" variant="light" color="green">
                <IconPackage size={20} />
              </ActionIcon>
              <Box>
                <Text fw={500}>Inventory Valuation</Text>
                <Text size="sm" c="dimmed">$125,430 total value</Text>
              </Box>
            </Group>
          </Card>
        </SimpleGrid>
      </Card>
    </>
  );
}
