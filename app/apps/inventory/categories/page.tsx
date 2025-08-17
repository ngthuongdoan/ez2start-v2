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
  noop
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCategory
} from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction, PageHeader } from '@/components';
import { Category } from '@/types';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: PATH_APPS.inventory.root },
  { title: 'Categories', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    created_at: '2025-01-10'
  },
  {
    id: '2',
    name: 'Computer Accessories',
    description: 'Keyboards, mice, cables, and other computer peripherals',
    parent_id: '1',
    created_at: '2025-01-11'
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Office and home furniture',
    created_at: '2025-01-12'
  },
  {
    id: '4',
    name: 'Office Chairs',
    description: 'Various types of office seating solutions',
    parent_id: '3',
    created_at: '2025-01-13'
  },
  {
    id: '5',
    name: 'Software',
    description: 'Software licenses and digital products',
    created_at: '2025-01-14'
  }
];

export default function CategoriesPage() {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Find parent category name
  const getParentCategoryName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = mockCategories.find(cat => cat.id === parentId);
    return parent?.name || 'Unknown';
  };

  // Define table columns
  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      title: 'Category Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      render: (category) => (
        <Group gap="xs">
          <ActionIcon size="sm" variant="light" color="blue">
            <IconCategory size={14} />
          </ActionIcon>
          <Stack gap={2}>
            <Text fw={500} size="sm">{category.name}</Text>
            {category.description && (
              <Text size="xs" c="dimmed" lineClamp={1}>
                {category.description}
              </Text>
            )}
          </Stack>
        </Group>
      ),
    },
    {
      key: 'parent_id',
      title: 'Parent Category',
      accessor: 'parent_id',
      sortable: true,
      filterable: true,
      render: (category) => {
        const parentName = getParentCategoryName(category.parent_id);
        return parentName ? (
          <Badge variant="light" color="gray" size="sm">
            {parentName}
          </Badge>
        ) : (
          <Text size="sm" c="dimmed">Root Category</Text>
        );
      },
    },
    {
      key: 'created_at',
      title: 'Created Date',
      accessor: 'created_at',
      sortable: true,
      render: (category) => (
        <Text size="sm">
          {category.created_at ? new Date(category.created_at).toLocaleDateString() : '-'}
        </Text>
      ),
    }
  ];

  // Count products in each category (mock data)
  const getProductCount = (categoryId: string) => {
    const counts: Record<string, number> = {
      '1': 45,
      '2': 23,
      '3': 18,
      '4': 12,
      '5': 8
    };
    return counts[categoryId] || 0;
  };

  // Add product count column
  columns.splice(2, 0, {
    key: 'product_count',
    title: 'Products',
    accessor: 'id',
    sortable: true,
    render: (category) => (
      <Badge variant="light" color="blue" size="sm">
        {getProductCount(category.id || '0')} items
      </Badge>
    ),
  });

  // Define table actions
  const actions: TableAction<Category>[] = [
    {
      label: 'View Products',
      icon: <IconEye />,
      color: 'blue',
      onClick: (category) => {
        router.push(`${PATH_APPS.inventory.products}?category=${category.id}`);
      },
    },
    {
      label: 'Edit',
      icon: <IconEdit />,
      color: 'orange',
      onClick: (category) => {
        setEditingCategory(category);
        setModalMode('edit');
        setModalOpened(true);
      },
    },
    {
      label: 'Delete',
      icon: <IconTrash />,
      color: 'red',
      onClick: (category) => {
        console.log('Delete category:', category);
      },
    },
  ];

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setModalMode('create');
    setModalOpened(true);
  };

  return (
    <>
      <TableLayout<Category>
        columns={columns}
        actions={actions}
        searchable
        filterable
        sortable
        title="Categories"
        collectionName="categories"
        onAdd={noop}
      />

      {/* TODO: Add Category Modal Component */}
      {/* <CategoryModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        mode={modalMode}
        category={editingCategory}
        categories={mockCategories}
        onSubmit={() => {
          setModalOpened(false);
          // Refresh data
        }}
      /> */}
    </>
  );
}
