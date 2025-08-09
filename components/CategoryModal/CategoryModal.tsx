import { Modal, TextInput, Textarea, Select, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CategoryDocument } from '@/types/schema';
import { CategoryFormData } from '@/types';

interface CategoryModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: CategoryDocument | null;
  categories: CategoryDocument[];
  onSubmit: (data: CategoryFormData) => void;
}

const CategoryModal = ({ opened, onClose, mode, category, categories, onSubmit }: CategoryModalProps) => {
  const form = useForm<CategoryFormData>({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      parent_id: category?.parent_id || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Category name must have at least 2 letters' : null),
    },
  });

  const handleSubmit = (values: CategoryFormData) => {
    onSubmit(values);
    form.reset();
  };

  // Filter out current category and its children from parent options
  const parentOptions = categories
    .filter(cat => cat.id !== category?.id && cat.parent_id !== category?.id)
    .map(cat => ({
      value: cat.id || '',
      label: cat.name || ''
    }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Category' : 'Edit Category'}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            required
            {...form.getInputProps('name')}
          />

          <Textarea
            label="Description"
            placeholder="Category description"
            rows={3}
            {...form.getInputProps('description')}
          />

          <Select
            label="Parent Category"
            placeholder="Select parent category (optional)"
            data={[
              { value: '', label: 'No parent (Root category)' },
              ...parentOptions
            ]}
            searchable
            clearable
            {...form.getInputProps('parent_id')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Category' : 'Update Category'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CategoryModal;
