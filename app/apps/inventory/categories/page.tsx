'use client';

import { TableAction, TableColumn, TableLayout } from '@/components';
import { PATH_APPS } from '@/routes';
import { Category } from '@/types/category';
import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  noop
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCategory,
  IconEdit,
  IconEye,
  IconTrash
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const getParentCategoryName = (parentid?: string) => {
  if (!parentid) return null;
  // const parent = mockCategories.find(cat => cat.id === parentid);
  return 'Unknown';
};
export default function CategoriesPage() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

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
        const parentName = getParentCategoryName(category.category_id);
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
    }
  ];

  // Count products in each category (mock data)
  const getProductCount = (categoryid: string) => {
    const counts: Record<string, number> = {
      '1': 45,
      '2': 23,
      '3': 18,
      '4': 12,
      '5': 8
    };
    return counts[categoryid] || 0;
  };

  // Add product count column
  columns.splice(2, 0, {
    key: 'product_count',
    title: 'Products',
    accessor: 'id',
    sortable: true,
    render: (category) => (
      <Badge variant="light" color="blue" size="sm">
        {getProductCount(category.category_id || '0')} items
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
        router.push(`${PATH_APPS.inventory.products}?category=${category.category_id}`);
      },
    },
    {
      label: 'Edit',
      icon: <IconEdit />,
      color: 'orange',
      onClick: (category) => {
        setEditingCategory(category);
        setModalMode('edit');
        open();
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
    open();
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
        opened={opened}
        onClose={close}
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
