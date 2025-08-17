'use client';

import { useState, useEffect, useId } from 'react';
import {
  TextInput,
  NumberInput,
  Select,
  Button,
  Stack,
  Title, 
} from '@mantine/core';
import { Employee } from '@/types/employee';
import { CustomModal, CustomModalProps } from '@/components/CustomModal/CustomModal';
import { notifications } from '@mantine/notifications';

type EmployeeModalProps ={
  onSuccess?: () => void;
  employee?: Employee | null; // For editing existing employee
  mode?: 'create' | 'edit';
} & Omit<CustomModalProps, "actions">

export default function EmployeeModal({ 
  opened, 
  onClose, 
  onSuccess,
  employee = null,
  mode = 'create',
  ...rest
}: EmployeeModalProps) {
  const formId = useId();
  const [form, setForm] = useState<Employee>(() => 
    employee || {
      name: '', 
      phone: '', 
      address: '', 
      username: '', 
      birth: '', 
      position: '', 
      salaryRate: 0, 
      assignedShift: ''
    }
  );
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (opened) {
      setForm(employee || {
        name: '', 
        phone: '', 
        address: '', 
        username: '', 
        birth: '', 
        position: '', 
        salaryRate: 0, 
        assignedShift: ''
      });
    }
  }, [opened, employee]);

  const handleTextChange = (field: keyof Employee) => (value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleNumberChange = (value: string | number) => {
    setForm({ ...form, salaryRate: typeof value === 'string' ? parseFloat(value) || 0 : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = mode === 'create' ? '/api/employees' : `/api/employees/${employee?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        onSuccess?.();
        onClose();
        // Reset form for next use
        setForm({
          name: '', 
          phone: '', 
          address: '', 
          username: '', 
          birth: '', 
          position: '', 
          salaryRate: 0, 
          assignedShift: ''
        });
      } else {
        notifications.show({ message: `Failed to ${mode} employee`, color: 'red' });
      }
    } catch (error: any) {
        notifications.show({ message: `Error ${mode === 'create' ? 'creating' : 'updating'} employee: ${error.message}`, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <CustomModal
      opened={opened}
      onClose={handleClose}
      title={
        <Title order={3}>
          {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
        </Title>
      }
      size="lg"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      actions={
          <>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              loaderProps={{ type: 'dots' }}
              form={formId}
            >
              {mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </>
      }
      {...rest}
    >
      <form onSubmit={handleSubmit} id={formId}>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter employee's full name"
            value={form.name}
            onChange={(event) => handleTextChange('name')(event.currentTarget.value)}
            required
            disabled={loading}
          />
          
          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(event) => handleTextChange('phone')(event.currentTarget.value)}
            required
            disabled={loading}
          />
          
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={form.address}
            onChange={(event) => handleTextChange('address')(event.currentTarget.value)}
            required
            disabled={loading}
          />
          
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={form.username}
            onChange={(event) => handleTextChange('username')(event.currentTarget.value)}
            required
            disabled={loading}
          />
          
          <TextInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            type="date"
            value={form.birth}
            onChange={(event) => handleTextChange('birth')(event.currentTarget.value)}
            required
            disabled={loading}
          />
          
          <Select
            label="Position"
            placeholder="Select position"
            value={form.position}
            onChange={(value) => handleTextChange('position')(value || '')}
            data={[
              'Manager',
              'Developer',
              'Designer',
              'Sales Representative',
              'Customer Service',
              'Marketing Specialist',
              'HR Specialist',
              'Accountant',
              'Operations Manager',
              'Quality Assurance'
            ]}
            searchable
            required
            disabled={loading}
          />
          
          <NumberInput
            label="Salary Rate (per hour)"
            placeholder="Enter hourly rate"
            value={form.salaryRate}
            onChange={handleNumberChange}
            min={0}
            step={0.01}
            prefix="$"
            decimalScale={2}
            required
            disabled={loading}
          />
          
          <Select
            label="Assigned Shift"
            placeholder="Select shift"
            value={form.assignedShift}
            onChange={(value) => handleTextChange('assignedShift')(value || '')}
            data={[
              'Morning (6AM - 2PM)',
              'Afternoon (2PM - 10PM)',
              'Night (10PM - 6AM)',
              'Full Time (9AM - 5PM)',
              'Part Time',
              'Flexible'
            ]}
            required
            disabled={loading}
          />
        </Stack>
      </form>
    </CustomModal>
  );
}
