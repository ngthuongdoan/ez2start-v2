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
  IconPhone,
  IconMail,
  IconTruck
} from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction, PageHeader } from '@/components';
import { Supplier } from '@/types';
import { PATH_APPS, PATH_DASHBOARD } from '@/routes';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Inventory', href: PATH_APPS.inventory.root },
  { title: 'Suppliers', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    contact_person: 'John Smith',
    email: 'orders@apple.com',
    phone: '+1-800-APL-CARE',
    address: '1 Apple Park Way, Cupertino, CA 95014',
    website: 'https://apple.com',
    tax_id: 'US-942404110',
    payment_terms: 'Net 30',
    status: 'active',
    created_at: '2025-01-10'
  },
  {
    id: '2',
    name: 'Logitech International',
    contact_person: 'Sarah Johnson',
    email: 'b2b@logitech.com',
    phone: '+41-21-863-5111',
    address: 'Apples, 1143 Switzerland',
    website: 'https://logitech.com',
    tax_id: 'CH-660.0.085.471-3',
    payment_terms: 'Net 15',
    status: 'active',
    created_at: '2025-01-12'
  },
  {
    id: '3',
    name: 'Herman Miller Inc.',
    contact_person: 'Mike Davis',
    email: 'sales@hermanmiller.com',
    phone: '+1-616-654-3000',
    address: '855 E Main Ave, Zeeland, MI 49464',
    website: 'https://hermanmiller.com',
    tax_id: 'US-381066397',
    payment_terms: 'Net 45',
    status: 'active',
    created_at: '2025-01-15'
  },
  {
    id: '4',
    name: 'Dell Technologies',
    contact_person: 'Lisa Brown',
    email: 'enterprise@dell.com',
    phone: '+1-800-WWW-DELL',
    address: 'One Dell Way, Round Rock, TX 78682',
    website: 'https://dell.com',
    tax_id: 'US-742516980',
    payment_terms: 'Net 30',
    status: 'inactive',
    created_at: '2025-01-08'
  }
];

export default function SuppliersPage() {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Define table columns
  const columns: TableColumn<Supplier>[] = [
    {
      key: 'name',
      title: 'Supplier',
      accessor: 'name',
      sortable: true,
      filterable: true,
      render: (supplier) => (
        <Group gap="xs">
          <ActionIcon size="sm" variant="light" color="orange">
            <IconTruck size={14} />
          </ActionIcon>
          <Stack gap={2}>
            <Text fw={500} size="sm">{supplier.name}</Text>
            {supplier.contact_person && (
              <Text size="xs" c="dimmed">
                Contact: {supplier.contact_person}
              </Text>
            )}
          </Stack>
        </Group>
      ),
    },
    {
      key: 'contact',
      title: 'Contact Info',
      accessor: 'email',
      render: (supplier) => (
        <Stack gap={4}>
          {supplier.email && (
            <Group gap="xs">
              <IconMail size={12} />
              <Text size="xs">{supplier.email}</Text>
            </Group>
          )}
          {supplier.phone && (
            <Group gap="xs">
              <IconPhone size={12} />
              <Text size="xs">{supplier.phone}</Text>
            </Group>
          )}
        </Stack>
      ),
    },
    {
      key: 'payment_terms',
      title: 'Payment Terms',
      accessor: 'payment_terms',
      sortable: true,
      filterable: true,
      render: (supplier) => (
        <Badge variant="light" color="blue" size="sm">
          {supplier.payment_terms || 'Not specified'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      render: (supplier) => (
        <Badge
          variant="light"
          color={supplier.status === 'active' ? 'green' : 'red'}
          size="sm"
        >
          {supplier.status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      title: 'Added Date',
      accessor: 'created_at',
      sortable: true,
      render: (supplier) => (
        <Text size="sm">
          {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString() : '-'}
        </Text>
      ),
    }
  ];

  // Define table actions
  const actions: TableAction<Supplier>[] = [
    {
      label: 'View Details',
      icon: <IconEye />,
      color: 'blue',
      onClick: (supplier) => {
        console.log('View supplier:', supplier);
      },
    },
    {
      label: 'Edit',
      icon: <IconEdit />,
      color: 'orange',
      onClick: (supplier) => {
        setEditingSupplier(supplier);
        setModalMode('edit');
        setModalOpened(true);
      },
    },
    {
      label: 'Delete',
      icon: <IconTrash />,
      color: 'red',
      onClick: (supplier) => {
        console.log('Delete supplier:', supplier);
      },
    },
  ];

  const handleCreateSupplier = () => {
    setEditingSupplier(null);
    setModalMode('create');
    setModalOpened(true);
  };

  return (
    <>
      <TableLayout<Supplier>
        title="Supplier List"
        collectionName='suppliers'
        columns={columns}
        actions={actions}
        searchable
        filterable
        sortable
        onAdd={noop}
      />

      {/* TODO: Add Supplier Modal Component */}
      {/* <SupplierModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        mode={modalMode}
        supplier={editingSupplier}
        onSubmit={() => {
          setModalOpened(false);
          // Refresh data
        }}
      /> */}
    </>
  );
}
