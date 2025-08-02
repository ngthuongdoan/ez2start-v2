'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Stack,
  Button,
  Anchor,
  Text,
  NumberFormatter,
  Card,
  SimpleGrid,
  Tabs,
  Progress
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconPlus,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconAdjustments,
  IconPackage,
  IconClipboardList
} from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction, PageHeader } from '@/components';
import { Stock, StockMovement, Product } from '@/types';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: PATH_APPS.inventory.root },
  { title: 'Stock Management', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

// Mock stock data
const mockStock: (Stock & { product: Product })[] = [
  {
    id: '1',
    product_id: '1',
    quantity_available: 25,
    quantity_reserved: 5,
    quantity_total: 30,
    location: 'Warehouse A',
    last_updated: '2025-08-02',
    product: {
      id: '1',
      name: 'MacBook Pro 14"',
      sku: 'MBP-14-001',
      unit: 'piece',
      cost_price: 1800,
      selling_price: 2200,
      min_stock_level: 5,
      status: 'active'
    }
  },
  {
    id: '2',
    product_id: '2',
    quantity_available: 15,
    quantity_reserved: 0,
    quantity_total: 15,
    location: 'Warehouse A',
    last_updated: '2025-08-01',
    product: {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'WM-001',
      unit: 'piece',
      cost_price: 25,
      selling_price: 45,
      min_stock_level: 20,
      status: 'active'
    }
  },
  {
    id: '3',
    product_id: '3',
    quantity_available: 8,
    quantity_reserved: 2,
    quantity_total: 10,
    location: 'Warehouse B',
    last_updated: '2025-07-30',
    product: {
      id: '3',
      name: 'Office Chair',
      sku: 'OC-ERG-001',
      unit: 'piece',
      cost_price: 400,
      selling_price: 650,
      min_stock_level: 10,
      status: 'active'
    }
  }
];

// Mock stock movements
const mockMovements: (StockMovement & { product: Product })[] = [
  {
    id: '1',
    product_id: '1',
    movement_type: 'in',
    quantity: 10,
    unit_cost: 1800,
    reference_type: 'purchase',
    reference_id: 'PO-001',
    supplier_id: '1',
    location: 'Warehouse A',
    notes: 'Regular restock order',
    created_at: '2025-08-02',
    product: {
      id: '1',
      name: 'MacBook Pro 14"',
      sku: 'MBP-14-001',
      unit: 'piece',
      cost_price: 1800,
      selling_price: 2200,
      min_stock_level: 5,
      status: 'active'
    }
  },
  {
    id: '2',
    product_id: '2',
    movement_type: 'out',
    quantity: 5,
    reference_type: 'sale',
    reference_id: 'SO-001',
    location: 'Warehouse A',
    notes: 'Customer order fulfillment',
    created_at: '2025-08-01',
    product: {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'WM-001',
      unit: 'piece',
      cost_price: 25,
      selling_price: 45,
      min_stock_level: 20,
      status: 'active'
    }
  }
];

export default function StockPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('current-stock');
  const [adjustmentModalOpened, setAdjustmentModalOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Stock | null>(null);

  // Get stock status
  const getStockStatus = (stock: Stock & { product: Product }) => {
    const { quantity_available, product } = stock;
    if (quantity_available === 0) return { status: 'out', color: 'red', label: 'Out of Stock' };
    if (quantity_available <= product.min_stock_level) return { status: 'low', color: 'orange', label: 'Low Stock' };
    return { status: 'good', color: 'green', label: 'Good' };
  };

  // Stock columns
  const stockColumns: TableColumn<Stock & { product: Product }>[] = [
    {
      key: 'product',
      title: 'Product',
      accessor: 'product.name',
      sortable: true,
      filterable: true,
      render: (stock) => (
        <Group gap="xs">
          <ActionIcon size="sm" variant="light" color="blue">
            <IconPackage size={14} />
          </ActionIcon>
          <Stack gap={2}>
            <Text fw={500} size="sm">{stock.product.name}</Text>
            <Text size="xs" c="dimmed">SKU: {stock.product.sku}</Text>
          </Stack>
        </Group>
      ),
    },
    {
      key: 'location',
      title: 'Location',
      accessor: 'location',
      sortable: true,
      filterable: true,
    },
    {
      key: 'quantity_available',
      title: 'Available',
      accessor: 'quantity_available',
      sortable: true,
      render: (stock) => {
        const status = getStockStatus(stock);
        return (
          <Group gap="xs">
            <Text fw={500} size="sm">{stock.quantity_available}</Text>
            <Badge size="xs" color={status.color} variant="light">
              {status.label}
            </Badge>
          </Group>
        );
      },
    },
    {
      key: 'quantity_reserved',
      title: 'Reserved',
      accessor: 'quantity_reserved',
      sortable: true,
      render: (stock) => (
        <Text size="sm">{stock.quantity_reserved}</Text>
      ),
    },
    {
      key: 'quantity_total',
      title: 'Total',
      accessor: 'quantity_total',
      sortable: true,
      render: (stock) => (
        <Text fw={500} size="sm">{stock.quantity_total}</Text>
      ),
    },
    {
      key: 'stock_level',
      title: 'Stock Level',
      accessor: 'quantity_available',
      render: (stock) => {
        const percentage = Math.min((stock.quantity_available / (stock.product.min_stock_level * 2)) * 100, 100);
        const status = getStockStatus(stock);
        return (
          <Stack gap={4}>
            <Progress value={percentage} color={status.color} size="sm" />
            <Text size="xs" c="dimmed">
              Min: {stock.product.min_stock_level}
            </Text>
          </Stack>
        );
      },
    }
  ];

  // Movement columns
  const movementColumns: TableColumn<StockMovement & { product: Product }>[] = [
    {
      key: 'created_at',
      title: 'Date',
      accessor: 'created_at',
      sortable: true,
      render: (movement) => (
        <Text size="sm">
          {movement.created_at ? new Date(movement.created_at).toLocaleDateString() : '-'}
        </Text>
      ),
    },
    {
      key: 'product',
      title: 'Product',
      accessor: 'product.name',
      sortable: true,
      filterable: true,
      render: (movement) => (
        <Stack gap={2}>
          <Text fw={500} size="sm">{movement.product.name}</Text>
          <Text size="xs" c="dimmed">SKU: {movement.product.sku}</Text>
        </Stack>
      ),
    },
    {
      key: 'movement_type',
      title: 'Type',
      accessor: 'movement_type',
      sortable: true,
      filterable: true,
      render: (movement) => (
        <Group gap="xs">
          <ActionIcon
            size="sm"
            variant="light"
            color={movement.movement_type === 'in' ? 'green' : 'red'}
          >
            {movement.movement_type === 'in' ?
              <IconTrendingUp size={14} /> :
              <IconTrendingDown size={14} />
            }
          </ActionIcon>
          <Badge
            color={movement.movement_type === 'in' ? 'green' : 'red'}
            variant="light"
            size="sm"
          >
            {movement.movement_type === 'in' ? 'Stock In' : 'Stock Out'}
          </Badge>
        </Group>
      ),
    },
    {
      key: 'quantity',
      title: 'Quantity',
      accessor: 'quantity',
      sortable: true,
      render: (movement) => (
        <Text fw={500} size="sm">
          {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
        </Text>
      ),
    },
    {
      key: 'reference_type',
      title: 'Reference',
      accessor: 'reference_type',
      render: (movement) => (
        <Stack gap={2}>
          <Badge variant="light" color="gray" size="sm">
            {movement.reference_type}
          </Badge>
          {movement.reference_id && (
            <Text size="xs" c="dimmed">{movement.reference_id}</Text>
          )}
        </Stack>
      ),
    },
    {
      key: 'notes',
      title: 'Notes',
      accessor: 'notes',
      render: (movement) => (
        <Text size="sm" lineClamp={2}>
          {movement.notes || '-'}
        </Text>
      ),
    }
  ];

  // Stock actions
  const stockActions: TableAction<Stock & { product: Product }>[] = [
    {
      label: 'Adjust Stock',
      icon: <IconAdjustments />,
      color: 'blue',
      onClick: (stock) => {
        setSelectedProduct(stock);
        setAdjustmentModalOpened(true);
      },
    },
    {
      label: 'View Details',
      icon: <IconEye />,
      color: 'green',
      onClick: (stock) => {
        console.log('View stock details:', stock);
      },
    },
  ];

  // Movement actions
  const movementActions: TableAction<StockMovement & { product: Product }>[] = [
    {
      label: 'View Details',
      icon: <IconEye />,
      color: 'blue',
      onClick: (movement) => {
        console.log('View movement details:', movement);
      },
    },
  ];

  const lowStockItems = mockStock.filter(stock => {
    const status = getStockStatus(stock);
    return status.status === 'low' || status.status === 'out';
  });

  return (
    <>
      <PageHeader
        title="Stock Management"
        breadcrumbItems={items}
        rightSection={
          <Group>
            <Button
              variant="light"
              leftSection={<IconAdjustments size={16} />}
              onClick={() => setAdjustmentModalOpened(true)}
            >
              Stock Adjustment
            </Button>
            <Button
              leftSection={<IconClipboardList size={16} />}
              onClick={() => router.push(PATH_APPS.inventory.reports)}
            >
              View Reports
            </Button>
          </Group>
        }
      />

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card shadow="sm" padding="md" radius="md" withBorder mb="xl" style={{ borderColor: 'orange' }}>
          <Group gap="xs" mb="sm">
            <IconAlertTriangle size={20} color="orange" />
            <Text fw={500} c="orange">Stock Alerts</Text>
          </Group>
          <Text size="sm" mb="md">
            You have {lowStockItems.length} items with low or out of stock levels.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
            {lowStockItems.slice(0, 3).map((stock) => {
              const status = getStockStatus(stock);
              return (
                <Card key={stock.id} padding="sm" radius="sm" withBorder>
                  <Group justify="space-between">
                    <Stack gap={2} flex={1}>
                      <Text fw={500} size="sm" lineClamp={1}>
                        {stock.product.name}
                      </Text>
                      <Group gap="xs">
                        <Text size="xs">Available: {stock.quantity_available}</Text>
                        <Text size="xs" c="dimmed">Min: {stock.product.min_stock_level}</Text>
                      </Group>
                    </Stack>
                    <Badge size="sm" color={status.color} variant="light">
                      {status.label}
                    </Badge>
                  </Group>
                </Card>
              );
            })}
          </SimpleGrid>
        </Card>
      )}

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'current-stock')}>
        <Tabs.List>
          <Tabs.Tab value="current-stock" leftSection={<IconPackage size={16} />}>
            Current Stock
          </Tabs.Tab>
          <Tabs.Tab value="movements" leftSection={<IconTrendingUp size={16} />}>
            Stock Movements
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="current-stock" pt="md">
          <TableLayout<Stock & { product: Product }>
            title="Current Stock"
            collectionName='stock'
            columns={stockColumns}
            actions={stockActions}
            searchable
            filterable
            sortable
          />
        </Tabs.Panel>

        <Tabs.Panel value="movements" pt="md">
          <TableLayout<StockMovement & { product: Product }>
            title="Stock Movements"
            collectionName='movements'
            columns={movementColumns}
            actions={movementActions}
            searchable
            filterable
            sortable
          />
        </Tabs.Panel>
      </Tabs>

      {/* TODO: Add Stock Adjustment Modal Component */}
      {/* <StockAdjustmentModal
        opened={adjustmentModalOpened}
        onClose={() => setAdjustmentModalOpened(false)}
        product={selectedProduct}
        onSubmit={() => {
          setAdjustmentModalOpened(false);
          // Refresh data
        }}
      /> */}
    </>
  );
}
