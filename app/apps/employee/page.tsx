'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionIcon, Badge, Container, Group, Stack } from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconPhone } from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction, EmployeeModal, PageHeader } from '@/components';
import { Employee } from '@/types/employee';

export default function EmployeeListPage() {
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [refreshKey, setRefreshKey] = useState(0);

  // Define table columns
  const columns: TableColumn<Employee>[] = [
    {
      key: 'name',
      title: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'username',
      title: 'Username',
      accessor: 'username',
      sortable: true,
      filterable: true,
    },
    {
      key: 'position',
      title: 'Position',
      accessor: 'position',
      sortable: true,
      filterable: true,
      render: (employee) => (
        <Badge variant="light" color="blue">
          {employee.position}
        </Badge>
      ),
    },
    {
      key: 'assignedShift',
      title: 'Shift',
      accessor: 'assignedShift',
      sortable: true,
      filterable: true,
      render: (employee) => (
        <Badge variant="outline" color="green">
          {employee.assignedShift}
        </Badge>
      ),
    },
    {
      key: 'salaryRate',
      title: 'Salary Rate',
      accessor: 'salaryRate',
      sortable: true,
      render: (employee) => `$${employee.salaryRate}/hr`,
    },
    {
      key: 'phone',
      title: 'Contact',
      render: (employee) => (
        <Group gap="xs">
          <ActionIcon size="sm" variant="subtle" color="blue">
            <IconPhone size={14} />
          </ActionIcon>
          {employee.phone}
        </Group>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Employee>[] = [
    {
      label: 'View',
      icon: <IconEye size={16} />,
      onClick: (employee) => router.push(`/apps/employee/${employee.id}`),
      color: 'blue',
      variant: 'light',
    },
    {
      label: 'Edit',
      icon: <IconEdit size={16} />,
      onClick: (employee) => {
        setEditingEmployee(employee);
        setModalMode('edit');
        setModalOpened(true);
      },
      color: 'orange',
      variant: 'light',
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      onClick: async (employee) => {
        if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
          try {
            await fetch(`/api/employees/${employee.id}`, {
              method: 'DELETE',
            });
            // Trigger table refresh
            setRefreshKey(prev => prev + 1);
          } catch (error) {
            console.error('Error deleting employee:', error);
          }
        }
      },
      color: 'red',
      variant: 'light',
    },
  ];

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setModalMode('create');
    setModalOpened(true);
  };

  const handleModalSuccess = () => {
    // Trigger table refresh
    setRefreshKey(prev => prev + 1);
  };

  const handleModalClose = () => {
    setModalOpened(false);
    setEditingEmployee(null);
  };

  return (
    <>
      <TableLayout<Employee>
        title="Employees"
        collectionName="employees"
        columns={columns}
        actions={actions}
        searchable
        filterable
        sortable
        pageSize={20}
        onRowClick={(employee: Employee) => router.push(`/apps/employee/${employee.id}`)}
        onAdd={handleAddEmployee}
        emptyStateText="No employees found. Add your first employee to get started."
        key={refreshKey} // This will force re-render when refreshKey changes
      />
      
      <EmployeeModal
        opened={modalOpened}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        employee={editingEmployee}
        mode={modalMode}
      />

    </>
  );
}
