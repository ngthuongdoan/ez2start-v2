import { Modal, TextInput, Textarea, Select, Button, Group, Stack, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Supplier, SupplierFormData } from '@/types';

interface SupplierModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  supplier?: Supplier | null;
  onSubmit: (data: SupplierFormData) => void;
}

const SupplierModal = ({ opened, onClose, mode, supplier, onSubmit }: SupplierModalProps) => {
  const form = useForm<SupplierFormData>({
    initialValues: {
      name: supplier?.name || '',
      contact_person: supplier?.contact_person || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      website: supplier?.website || '',
      tax_id: supplier?.tax_id || '',
      payment_terms: supplier?.payment_terms || '',
      status: supplier?.status || 'active',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Supplier name must have at least 2 letters' : null),
      email: (value) => (value && !/^\S+@\S+$/.test(value) ? 'Invalid email' : null),
      website: (value) => (value && !/^https?:\/\//.test(value) ? 'Website must start with http:// or https://' : null),
    },
  });

  const handleSubmit = (values: SupplierFormData) => {
    onSubmit(values);
    form.reset();
  };

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const paymentTerms = [
    { value: 'Net 15', label: 'Net 15 days' },
    { value: 'Net 30', label: 'Net 30 days' },
    { value: 'Net 45', label: 'Net 45 days' },
    { value: 'Net 60', label: 'Net 60 days' },
    { value: 'COD', label: 'Cash on Delivery' },
    { value: 'Prepaid', label: 'Prepaid' },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Supplier' : 'Edit Supplier'}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Supplier Name"
                placeholder="Enter supplier name"
                required
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Status"
                data={statuses}
                required
                {...form.getInputProps('status')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Person"
                placeholder="Primary contact name"
                {...form.getInputProps('contact_person')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                placeholder="contact@supplier.com"
                type="email"
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                placeholder="+1-555-123-4567"
                {...form.getInputProps('phone')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Website"
                placeholder="https://supplier.com"
                {...form.getInputProps('website')}
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Address"
            placeholder="Supplier address"
            rows={3}
            {...form.getInputProps('address')}
          />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Tax ID"
                placeholder="Tax identification number"
                {...form.getInputProps('tax_id')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Payment Terms"
                placeholder="Select payment terms"
                data={paymentTerms}
                searchable
                {...form.getInputProps('payment_terms')}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Supplier' : 'Update Supplier'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default SupplierModal;
