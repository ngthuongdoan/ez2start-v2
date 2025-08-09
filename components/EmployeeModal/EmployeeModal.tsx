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
import { notifications } from '@/utils/notifications';
import { useForm } from '@mantine/form';
type EmployeeModalProps ={
  onSuccess?: () => void;
  employee?: Employee | null; // For editing existing employee
  mode?: 'create' | 'edit';
} & Omit<CustomModalProps, "actions">

const INITIAL_EMPLOYEE: Employee = {
  full_name: '',
  email: '',
  phone: '',
  role: '',
  permissions: [],
  hourly_rate: 0,
  username: '',
  position: '',
  assigned_shift: '',
  dob: '', // Date of Birth
  address: '', // Optional address field
  business_id: '', // Ensure business_id is included
  user_uid: '', // Ensure user_uid is included
  employee_id: '', // This will be set when creating a new employee
  is_active: true, // Default to active
};

export default function EmployeeModal({ 
  opened, 
  onClose, 
  onSuccess,
  employee = null,
  mode = 'create',
  ...rest
}: EmployeeModalProps) {
  const formId = useId();
  const form = useForm<Employee>({
    initialValues: INITIAL_EMPLOYEE,
    validate: {
      full_name: (value) => (value ? null : 'Full name is required'),
      email: (value) => (value ? null : 'Email is required'),
      phone: (value) => (value ? null : 'Phone number is required'),
    },
  });

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (opened && employee) {
      form.setInitialValues(mode === 'edit' ? employee : INITIAL_EMPLOYEE);
    }
  }, [opened, employee, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = mode === 'create' ? '/api/employees' : `/api/employees/${employee?.employee_id}`;
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
        form.reset();
      } else {
        notifications.show({ message: `Failed to ${mode} employee`, type: 'error' });
      }
    } catch (error: any) {
      notifications.show({ message: `Error ${mode === 'create' ? 'creating' : 'updating'} employee: ${error.message}`, type: 'error' });
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
            required
            disabled={loading}
            {...form.getInputProps('full_name')}
          />
          
          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            required
            disabled={loading}
            {...form.getInputProps('phone')}
          />
          
          <TextInput
            label="Address"
            placeholder="Enter address"
            required
            disabled={loading}
            {...form.getInputProps('address')}
          />
          
          <TextInput
            label="Username"
            placeholder="Enter username"
            required
            disabled={loading}
            {...form.getInputProps('username')}
          />
          
          <TextInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            type="date"
            required
            disabled={loading}
            {...form.getInputProps('dob')}
          />
          
          <Select
            label="Position"
            placeholder="Select position"
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
            {...form.getInputProps('position')}
          />
          
          <NumberInput
            label="Salary Rate (per hour)"
            placeholder="Enter hourly rate"
            min={0}
            step={0.01}
            prefix="$"
            decimalScale={2}
            required
            disabled={loading}
            {...form.getInputProps('hourly_rate')}
          />
          
          <Select
            label="Assigned Shift"
            placeholder="Select shift"
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
            {...form.getInputProps('assigned_shift')}
          />
        </Stack>
      </form>
    </CustomModal>
  );
}
