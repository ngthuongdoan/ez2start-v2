'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionIcon, Group, Badge, Select } from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconPhone, IconMail } from '@tabler/icons-react';
import { TableLayout, TableColumn, TableAction } from '@/components';
import { Employee } from '@/types/employee';

export default function EmployeeTablePage() {
  const router = useRouter();
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [shiftFilter, setShiftFilter] = useState<string>('');

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
      onClick: (employee) => router.push(`/apps/employee/${employee.id}/edit`),
      color: 'orange',
      variant: 'light',
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      onClick: (employee) => {
        if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
          // Handle delete logic here
          console.log('Delete employee:', employee.id);
        }
      },
      color: 'red',
      variant: 'light',
    },
  ];

  // Custom filters
  const customFilters = (
    <Group>
      <Select
        placeholder="Filter by Position"
        value={positionFilter}
        onChange={(value) => setPositionFilter(value || '')}
        data={[
          { value: '', label: 'All Positions' },
          { value: 'Manager', label: 'Manager' },
          { value: 'Developer', label: 'Developer' },
          { value: 'Designer', label: 'Designer' },
          { value: 'Sales', label: 'Sales' },
        ]}
        clearable
      />
      <Select
        placeholder="Filter by Shift"
        value={shiftFilter}
        onChange={(value) => setShiftFilter(value || '')}
        data={[
          { value: '', label: 'All Shifts' },
          { value: 'Morning', label: 'Morning' },
          { value: 'Afternoon', label: 'Afternoon' },
          { value: 'Night', label: 'Night' },
        ]}
        clearable
      />
    </Group>
  );

  return (
    <TableLayout<Employee>
      collectionName="employees"
      title="Employee Management"
      description="Manage your employees, their details, and assignments"
      columns={columns}
      actions={actions}
      searchable
      filterable
      sortable
      pageSize={20}
      onRowClick={(employee) => router.push(`/apps/employee/${employee.id}`)}
      onAdd={() => router.push('/apps/employee/new')}
      customFilters={customFilters}
      emptyStateText="No employees found. Add your first employee to get started."
    />
  );
}
