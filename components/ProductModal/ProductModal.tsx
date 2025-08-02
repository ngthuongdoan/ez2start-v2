import { Modal, TextInput, Textarea, NumberInput, Select, Button, Group, Stack, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Product, ProductFormData } from '@/types';

interface ProductModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
}

const ProductModal = ({ opened, onClose, mode, product, onSubmit }: ProductModalProps) => {
  const form = useForm<ProductFormData>({
    initialValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      category_id: product?.category_id || '',
      brand: product?.brand || '',
      unit: product?.unit || 'piece',
      cost_price: product?.cost_price || 0,
      selling_price: product?.selling_price || 0,
      min_stock_level: product?.min_stock_level || 0,
      max_stock_level: product?.max_stock_level || undefined,
      barcode: product?.barcode || '',
      status: product?.status || 'active',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      sku: (value) => (value.length < 2 ? 'SKU is required' : null),
      cost_price: (value) => (value <= 0 ? 'Cost price must be greater than 0' : null),
      selling_price: (value) => (value <= 0 ? 'Selling price must be greater than 0' : null),
      min_stock_level: (value) => (value < 0 ? 'Minimum stock level cannot be negative' : null),
    },
  });

  const handleSubmit = (values: ProductFormData) => {
    onSubmit(values);
    form.reset();
  };

  // Mock categories - in real app, this would come from props or API
  const categories = [
    { value: '1', label: 'Electronics' },
    { value: '2', label: 'Computer Accessories' },
    { value: '3', label: 'Furniture' },
    { value: '4', label: 'Office Chairs' },
    { value: '5', label: 'Software' },
  ];

  const units = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
    { value: 'meter', label: 'Meter' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Product' : 'Edit Product'}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                required
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="SKU"
                placeholder="Product SKU"
                required
                {...form.getInputProps('sku')}
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Product description"
            rows={3}
            {...form.getInputProps('description')}
          />

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Category"
                placeholder="Select category"
                data={categories}
                searchable
                {...form.getInputProps('category_id')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Brand"
                placeholder="Product brand"
                {...form.getInputProps('brand')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Unit"
                placeholder="Select unit"
                data={units}
                required
                {...form.getInputProps('unit')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Cost Price"
                placeholder="0.00"
                prefix="$"
                decimalScale={2}
                required
                {...form.getInputProps('cost_price')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Selling Price"
                placeholder="0.00"
                prefix="$"
                decimalScale={2}
                required
                {...form.getInputProps('selling_price')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Minimum Stock Level"
                placeholder="0"
                min={0}
                required
                {...form.getInputProps('min_stock_level')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Maximum Stock Level"
                placeholder="Optional"
                min={0}
                {...form.getInputProps('max_stock_level')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Barcode"
                placeholder="Product barcode"
                {...form.getInputProps('barcode')}
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

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Product' : 'Update Product'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ProductModal;
