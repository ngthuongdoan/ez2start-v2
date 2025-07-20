'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Paper,
  Title,
  Stack,
  Group,
  Container,
  Text,
  Badge,
  LoadingOverlay
} from '@mantine/core';
import { EmployeeModal } from '@/components';
import { Employee } from '@/types/employee';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const router = useRouter();

  const fetchEmployee = () => {
    setLoading(true);
    fetch(`/api/employees/${id}`)
      .then(res => res.json())
      .then(setEmployee)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${employee?.name}?`)) {
      try {
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        router.push('/apps/employee');
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleModalSuccess = () => {
    fetchEmployee(); // Refresh employee data
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl">
        <LoadingOverlay visible={loading} />
        
        {employee && (
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={2}>{employee.name}</Title>
              <Group>
                <Button
                  variant="outline"
                  onClick={() => setModalOpened(true)}
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  variant="outline"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Group>
            </Group>
            
            <Stack gap="sm">
              <Group>
                <Text fw={500}>Phone:</Text>
                <Text>{employee.phone}</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Address:</Text>
                <Text>{employee.address}</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Username:</Text>
                <Text>{employee.username}</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Date of Birth:</Text>
                <Text>{employee.birth}</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Position:</Text>
                <Badge variant="light" color="blue">{employee.position}</Badge>
              </Group>
              
              <Group>
                <Text fw={500}>Salary Rate:</Text>
                <Text fw={500} c="green">${employee.salaryRate}/hr</Text>
              </Group>
              
              <Group>
                <Text fw={500}>Assigned Shift:</Text>
                <Badge variant="outline" color="green">{employee.assignedShift}</Badge>
              </Group>
            </Stack>
          </Stack>
        )}
      </Paper>
      
      <EmployeeModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSuccess={handleModalSuccess}
        employee={employee}
        mode="edit"
      />
    </Container>
  );
}
