'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Anchor,
  SimpleGrid,
  Select,
  Tabs,
  Badge,
  ActionIcon,
  NumberFormatter,
  Progress
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconReportAnalytics,
  IconDownload,
  IconCalendar,
  IconFilter,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconPackage,
  IconCategory,
  IconTruck
} from '@tabler/icons-react';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';
import { PageHeader, TableLayout, TableColumn } from '@/components';
import { InventoryReport, Product } from '@/types';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: PATH_APPS.inventory.root },
  { title: 'Reports', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

// Mock report data
const mockInventoryReport: InventoryReport[] = [
  {
    product_id: '1',
    product_name: 'MacBook Pro 14"',
    sku: 'MBP-14-001',
    category: 'Electronics',
    current_stock: 25,
    min_stock_level: 5,
    stock_status: 'good',
    last_movement_date: '2025-08-02',
    inventory_value: 45000
  },
  {
    product_id: '2',
    product_name: 'Wireless Mouse',
    sku: 'WM-001',
    category: 'Computer Accessories',
    current_stock: 15,
    min_stock_level: 20,
    stock_status: 'low',
    last_movement_date: '2025-08-01',
    inventory_value: 675
  },
  {
    product_id: '3',
    product_name: 'Office Chair',
    sku: 'OC-ERG-001',
    category: 'Furniture',
    current_stock: 8,
    min_stock_level: 10,
    stock_status: 'low',
    last_movement_date: '2025-07-30',
    inventory_value: 5200
  }
];

const reportSummary = {
  total_products: 245,
  total_value: 125430,
  low_stock_count: 23,
  out_of_stock_count: 5,
  categories_count: 12,
  suppliers_count: 18
};

export default function InventoryReportsPage() {
  const [activeTab, setActiveTab] = useState<string>('inventory-report');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Get stock status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'good':
        return { color: 'green', label: 'Good Stock' };
      case 'low':
        return { color: 'orange', label: 'Low Stock' };
      case 'critical':
        return { color: 'red', label: 'Critical' };
      case 'out':
        return { color: 'red', label: 'Out of Stock' };
      default:
        return { color: 'gray', label: 'Unknown' };
    }
  };

  // Inventory report columns
  const inventoryReportColumns: TableColumn<InventoryReport>[] = [
    {
      key: 'product_name',
      title: 'Product',
      accessor: 'product_name',
      sortable: true,
      filterable: true,
      render: (report) => (
        <Stack gap={2}>
          <Text fw={500} size="sm">{report.product_name}</Text>
          <Text size="xs" c="dimmed">SKU: {report.sku}</Text>
        </Stack>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      accessor: 'category',
      sortable: true,
      filterable: true,
      render: (report) => (
        <Badge variant="light" color="blue" size="sm">
          {report.category}
        </Badge>
      ),
    },
    {
      key: 'current_stock',
      title: 'Current Stock',
      accessor: 'current_stock',
      sortable: true,
      render: (report) => (
        <Group gap="xs">
          <Text fw={500} size="sm">{report.current_stock}</Text>
          <Text size="xs" c="dimmed">/ {report.min_stock_level} min</Text>
        </Group>
      ),
    },
    {
      key: 'stock_status',
      title: 'Status',
      accessor: 'stock_status',
      sortable: true,
      filterable: true,
      render: (report) => {
        const statusInfo = getStatusInfo(report.stock_status);
        const percentage = Math.min((report.current_stock / (report.min_stock_level * 2)) * 100, 100);
        return (
          <Stack gap={4}>
            <Badge color={statusInfo.color} variant="light" size="sm">
              {statusInfo.label}
            </Badge>
            <Progress value={percentage} color={statusInfo.color} size="xs" />
          </Stack>
        );
      },
    },
    {
      key: 'inventory_value',
      title: 'Value',
      accessor: 'inventory_value',
      sortable: true,
      render: (report) => (
        <Text fw={500} size="sm">
          <NumberFormatter
            value={report.inventory_value}
            prefix="$"
            thousandSeparator=","
            decimalScale={0}
          />
        </Text>
      ),
    },
    {
      key: 'last_movement_date',
      title: 'Last Movement',
      accessor: 'last_movement_date',
      sortable: true,
      render: (report) => (
        <Text size="sm">
          {report.last_movement_date ?
            new Date(report.last_movement_date).toLocaleDateString() :
            'No movements'
          }
        </Text>
      ),
    }
  ];

  const handleExportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <>
      <PageHeader
        title="Inventory Reports"
        breadcrumbItems={items}
        rightSection={
          <Group>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={() => handleExportReport('excel')}
            >
              Export Excel
            </Button>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={() => handleExportReport('pdf')}
            >
              Export PDF
            </Button>
          </Group>
        }
      />

      {/* Report Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <ActionIcon size="xl" variant="light" color="blue">
              <IconPackage size={24} />
            </ActionIcon>
            <Stack gap={0}>
              <Text size="lg" fw={700}>{reportSummary.total_products}</Text>
              <Text size="sm" c="dimmed">Total Products</Text>
            </Stack>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <ActionIcon size="xl" variant="light" color="green">
              <IconTrendingUp size={24} />
            </ActionIcon>
            <Stack gap={0}>
              <Text size="lg" fw={700}>
                <NumberFormatter
                  value={reportSummary.total_value}
                  prefix="$"
                  thousandSeparator=","
                  decimalScale={0}
                />
              </Text>
              <Text size="sm" c="dimmed">Total Value</Text>
            </Stack>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <ActionIcon size="xl" variant="light" color="orange">
              <IconAlertTriangle size={24} />
            </ActionIcon>
            <Stack gap={0}>
              <Text size="lg" fw={700}>{reportSummary.low_stock_count}</Text>
              <Text size="sm" c="dimmed">Low Stock Items</Text>
            </Stack>
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group>
            <ActionIcon size="xl" variant="light" color="red">
              <IconTrendingDown size={24} />
            </ActionIcon>
            <Stack gap={0}>
              <Text size="lg" fw={700}>{reportSummary.out_of_stock_count}</Text>
              <Text size="sm" c="dimmed">Out of Stock</Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Group>
          <Text fw={500} size="sm">Filters:</Text>
          <Select
            placeholder="Category"
            data={[
              { value: '', label: 'All Categories' },
              { value: 'electronics', label: 'Electronics' },
              { value: 'furniture', label: 'Furniture' },
              { value: 'accessories', label: 'Accessories' }
            ]}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value || '')}
            leftSection={<IconCategory size={16} />}
            clearable
          />
          <Select
            placeholder="Stock Status"
            data={[
              { value: '', label: 'All Status' },
              { value: 'good', label: 'Good Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'out', label: 'Out of Stock' }
            ]}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value || '')}
            leftSection={<IconFilter size={16} />}
            clearable
          />
          <DatePickerInput
            type="range"
            placeholder="Date range"
            value={dateRange}
            onChange={(value) => {
              if (!value) {
                setDateRange([null, null]);
              } else {
                setDateRange([
                  value[0] ? new Date(value[0]) : null,
                  value[1] ? new Date(value[1]) : null
                ]);
              }
            }}
            leftSection={<IconCalendar size={16} />}
            clearable
          />
        </Group>
      </Card>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'inventory-report')}>
        <Tabs.List>
          <Tabs.Tab value="inventory-report" leftSection={<IconReportAnalytics size={16} />}>
            Inventory Report
          </Tabs.Tab>
          <Tabs.Tab value="low-stock" leftSection={<IconAlertTriangle size={16} />}>
            Low Stock Alert
          </Tabs.Tab>
          <Tabs.Tab value="valuation" leftSection={<IconTrendingUp size={16} />}>
            Inventory Valuation
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="inventory-report" pt="md">
          <TableLayout<InventoryReport>
            title="Inventory Report"
            collectionName="inventory_report"
            columns={inventoryReportColumns}
            actions={[]}
            searchable
            filterable
            sortable
          />
        </Tabs.Panel>

        <Tabs.Panel value="low-stock" pt="md">
          <TableLayout<InventoryReport>
            title="Low Stock Alert"
            collectionName="inventory_report"
            columns={inventoryReportColumns}
            actions={[]}
            searchable
            filterable
            sortable
          />
        </Tabs.Panel>

        <Tabs.Panel value="valuation" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={500} mb="md">Inventory Valuation by Category</Text>

                <Stack gap="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <ActionIcon size="sm" variant="light" color="blue">
                        <IconCategory size={14} />
                      </ActionIcon>
                      <Text>Electronics</Text>
                    </Group>
                    <Group gap="md">
                      <Text size="sm" c="dimmed">$89,250</Text>
                      <Progress value={71.4} color="blue" style={{ width: 100 }} />
                    </Group>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <ActionIcon size="sm" variant="light" color="green">
                        <IconCategory size={14} />
                      </ActionIcon>
                      <Text>Furniture</Text>
                    </Group>
                    <Group gap="md">
                      <Text size="sm" c="dimmed">$25,680</Text>
                      <Progress value={20.5} color="green" style={{ width: 100 }} />
                    </Group>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <ActionIcon size="sm" variant="light" color="orange">
                        <IconCategory size={14} />
                      </ActionIcon>
                      <Text>Accessories</Text>
                    </Group>
                    <Group gap="md">
                      <Text size="sm" c="dimmed">$10,500</Text>
                      <Progress value={8.4} color="orange" style={{ width: 100 }} />
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={500} mb="md">Summary</Text>

                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">Total Inventory Value:</Text>
                    <Text fw={500}>
                      <NumberFormatter
                        value={125430}
                        prefix="$"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm">Average Product Value:</Text>
                    <Text fw={500}>
                      <NumberFormatter
                        value={512}
                        prefix="$"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm">Top Category:</Text>
                    <Badge color="blue" variant="light">Electronics</Badge>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm">Last Updated:</Text>
                    <Text size="sm" c="dimmed">Aug 2, 2025</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
