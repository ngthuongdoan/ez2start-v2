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
  noop
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertCircle
} from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction, PageHeader } from '@/components';
import { Product } from '@/types';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: PATH_APPS.inventory.root },
  { title: 'Products', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14"',
    sku: 'MBP-14-001',
    description: 'MacBook Pro 14-inch with M3 chip',
    category_id: '1',
    brand: 'Apple',
    unit: 'piece',
    cost_price: 1800,
    selling_price: 2200,
    min_stock_level: 5,
    max_stock_level: 50,
    barcode: '123456789001',
    status: 'active',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    description: 'Ergonomic wireless mouse with USB receiver',
    category_id: '2',
    brand: 'Logitech',
    unit: 'piece',
    cost_price: 25,
    selling_price: 45,
    min_stock_level: 20,
    max_stock_level: 200,
    barcode: '123456789002',
    status: 'active',
    created_at: '2025-01-20'
  },
  {
    id: '3',
    name: 'Office Chair',
    sku: 'OC-ERG-001',
    description: 'Ergonomic office chair with lumbar support',
    category_id: '3',
    brand: 'Herman Miller',
    unit: 'piece',
    cost_price: 400,
    selling_price: 650,
    min_stock_level: 10,
    max_stock_level: 30,
    barcode: '123456789003',
    status: 'active',
    created_at: '2025-01-22'
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Define table columns
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Product Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      render: (product) => (
        <Stack gap={4}>
          <Text fw={500} size="sm">{product.name}</Text>
          <Text size="xs" c="dimmed">SKU: {product.sku}</Text>
        </Stack>
      ),
    },
    {
      key: 'brand',
      title: 'Brand',
      accessor: 'brand',
      sortable: true,
      filterable: true,
    },
    {
      key: 'unit',
      title: 'Unit',
      accessor: 'unit',
      sortable: true,
      filterable: true,
      render: (product) => (
        <Badge variant="light" color="gray" size="sm">
          {product.unit}
        </Badge>
      ),
    },
    {
      key: 'cost_price',
      title: 'Cost Price',
      accessor: 'cost_price',
      sortable: true,
      render: (product) => (
        <NumberFormatter
          value={product.cost_price}
          prefix="$"
          thousandSeparator=","
          decimalScale={2}
        />
      ),
    },
    {
      key: 'selling_price',
      title: 'Selling Price',
      accessor: 'selling_price',
      sortable: true,
      render: (product) => (
        <NumberFormatter
          value={product.selling_price}
          prefix="$"
          thousandSeparator=","
          decimalScale={2}
        />
      ),
    },
    {
      key: 'min_stock_level',
      title: 'Min Stock',
      accessor: 'min_stock_level',
      sortable: true,
      render: (product) => (
        <Group gap="xs">
          <Text size="sm">{product.min_stock_level}</Text>
          <IconAlertCircle size={14} color="orange" />
        </Group>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      render: (product) => (
        <Badge
          variant="light"
          color={product.status === 'active' ? 'green' : 'red'}
          size="sm"
        >
          {product.status}
        </Badge>
      ),
    }
  ];

  // Define table actions
  const actions: TableAction<Product>[] = [
    {
      label: 'View',
      icon: <IconEye />,
      color: 'blue',
      onClick: (product) => {
        console.log('View product:', product);
      },
    },
    {
      label: 'Edit',
      icon: <IconEdit />,
      color: 'orange',
      onClick: (product) => {
        setEditingProduct(product);
        setModalMode('edit');
        setModalOpened(true);
      },
    },
    {
      label: 'Delete',
      icon: <IconTrash />,
      color: 'red',
      onClick: (product) => {
        console.log('Delete product:', product);
      },
    },
  ];

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setModalMode('create');
    setModalOpened(true);
  };

  return (
    <>
      <TableLayout<Product>
        columns={columns}
        actions={actions}
        searchable
        filterable
        sortable
        title="Products"
        collectionName="products"
        onAdd={noop}
      />

      {/* TODO: Add Product Modal Component */}
      {/* <ProductModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        mode={modalMode}
        product={editingProduct}
        onSubmit={() => {
          setModalOpened(false);
          // Refresh data
        }}
      /> */}
    </>
  );
}
