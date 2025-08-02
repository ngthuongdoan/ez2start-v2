import { Modal, Select, NumberInput, Textarea, Button, Group, Stack, Text, Badge, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { Stock, Product, StockAdjustmentFormData } from '@/types';

interface StockAdjustmentModalProps {
  opened: boolean;
  onClose: () => void;
  product?: (Stock & { product: Product }) | null;
  onSubmit: (data: StockAdjustmentFormData) => void;
}

const StockAdjustmentModal = ({ opened, onClose, product, onSubmit }: StockAdjustmentModalProps) => {
  const form = useForm<StockAdjustmentFormData>({
    initialValues: {
      product_id: product?.product_id || '',
      adjustment_type: 'increase',
      quantity: 0,
      unit_cost: product?.product?.cost_price || 0,
      reason: '',
      notes: '',
    },
    validate: {
      quantity: (value) => (value <= 0 ? 'Quantity must be greater than 0' : null),
      reason: (value) => (value.length < 3 ? 'Reason must be at least 3 characters' : null),
    },
  });

  const handleSubmit = (values: StockAdjustmentFormData) => {
    onSubmit(values);
    form.reset();
  };

  const adjustmentTypes = [
    { value: 'increase', label: 'Increase Stock' },
    { value: 'decrease', label: 'Decrease Stock' },
    { value: 'set', label: 'Set Exact Amount' },
  ];

  const reasons = [
    { value: 'Purchase Order', label: 'Purchase Order' },
    { value: 'Sale', label: 'Sale' },
    { value: 'Return', label: 'Return' },
    { value: 'Damaged Goods', label: 'Damaged Goods' },
    { value: 'Lost Items', label: 'Lost Items' },
    { value: 'Inventory Count', label: 'Inventory Count' },
    { value: 'Transfer', label: 'Transfer' },
    { value: 'Other', label: 'Other' },
  ];

  const calculateNewStock = () => {
    if (!product) return 0;

    const currentStock = product.quantity_available;
    const adjustmentQty = form.values.quantity;

    switch (form.values.adjustment_type) {
      case 'increase':
        return currentStock + adjustmentQty;
      case 'decrease':
        return Math.max(0, currentStock - adjustmentQty);
      case 'set':
        return adjustmentQty;
      default:
        return currentStock;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Stock Adjustment"
      size="md"
    >
      {product && (
        <Alert icon={<IconInfoCircle size={16} />} mb="md" variant="light">
          <Text size="sm" fw={500}>{product.product.name}</Text>
          <Text size="xs" c="dimmed">
            Current Stock: {product.quantity_available} {product.product.unit}s
            {product.quantity_reserved > 0 && ` (${product.quantity_reserved} reserved)`}
          </Text>
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Adjustment Type"
            placeholder="Select adjustment type"
            data={adjustmentTypes}
            required
            {...form.getInputProps('adjustment_type')}
          />

          <NumberInput
            label={
              form.values.adjustment_type === 'set'
                ? 'Set Stock To'
                : 'Quantity'
            }
            placeholder="Enter quantity"
            min={0}
            required
            {...form.getInputProps('quantity')}
          />

          {form.values.adjustment_type === 'increase' && (
            <NumberInput
              label="Unit Cost"
              placeholder="Cost per unit"
              prefix="$"
              decimalScale={2}
              {...form.getInputProps('unit_cost')}
            />
          )}

          <Select
            label="Reason"
            placeholder="Select reason"
            data={reasons}
            searchable
            required
            {...form.getInputProps('reason')}
          />

          <Textarea
            label="Notes"
            placeholder="Additional notes (optional)"
            rows={3}
            {...form.getInputProps('notes')}
          />

          {product && form.values.quantity > 0 && (
            <Alert variant="light" color="blue">
              <Group justify="space-between">
                <Text size="sm">New Stock Level:</Text>
                <Badge size="lg" variant="light" color="blue">
                  {calculateNewStock()} {product.product.unit}s
                </Badge>
              </Group>
            </Alert>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Apply Adjustment
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default StockAdjustmentModal;
