# TableLayout Component

A reusable table component with Firestore integration, featuring search, filtering, pagination, and CRUD operations.

## Features

- 🔥 **Firestore Integration**: Direct connection to Firebase Firestore collections
- 🔍 **Search**: Real-time search across specified fields
- 🗂️ **Filtering**: Custom filters and column-based filtering
- 📄 **Pagination**: Efficient pagination with Firestore cursor-based pagination
- 📊 **Sorting**: Column-based sorting with visual indicators
- ⚡ **Actions**: Configurable row actions (view, edit, delete, etc.)
- 🎨 **Customizable**: Highly customizable columns and rendering
- 📱 **Responsive**: Works on all screen sizes

## Installation

The component uses the following dependencies (already included in your project):

```json
{
  "mantine-datatable": "^7.1.7",
  "@mantine/core": "^7.2.2",
  "@mantine/hooks": "^7.2.2",
  "@tabler/icons-react": "^2.40.0",
  "firebase": "^11.9.1"
}
```

## Basic Usage

```tsx
import { TableLayout, TableColumn, TableAction } from '@/components';
import { Employee } from '@/types/employee';

const columns: TableColumn<Employee>[] = [
  {
    key: 'name',
    title: 'Name',
    accessor: 'name',
    sortable: true,
    filterable: true,
  },
  {
    key: 'position',
    title: 'Position',
    accessor: 'position',
    render: (employee) => (
      <Badge color="blue">{employee.position}</Badge>
    ),
  },
];

const actions: TableAction<Employee>[] = [
  {
    label: 'Edit',
    icon: <IconEdit size={16} />,
    onClick: (employee) => router.push(`/edit/${employee.id}`),
    color: 'blue',
  },
];

function EmployeeTable() {
  return (
    <TableLayout<Employee>
      collectionName="employees"
      title="Employee Management"
      columns={columns}
      actions={actions}
      onAdd={() => router.push('/employees/new')}
    />
  );
}
```

## Props

### TableLayoutProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collectionName` | `string` | - | **Required.** Firestore collection name |
| `columns` | `TableColumn<T>[]` | - | **Required.** Column definitions |
| `actions` | `TableAction<T>[]` | `[]` | Row action buttons |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `filterable` | `boolean` | `true` | Enable column filtering |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `pageSize` | `number` | `25` | Number of records per page |
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `onRowClick` | `(record: T) => void` | - | Row click handler |
| `onAdd` | `() => void` | - | Add button click handler |
| `customFilters` | `ReactNode` | - | Custom filter components |
| `emptyStateText` | `string` | `"No data found"` | Empty state message |

### TableColumn<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | - | **Required.** Unique column key |
| `title` | `string` | - | **Required.** Column header title |
| `accessor` | `string` | `key` | Data accessor path |
| `render` | `(record: T) => ReactNode` | - | Custom render function |
| `sortable` | `boolean` | `true` | Enable sorting for this column |
| `filterable` | `boolean` | `true` | Include in search fields |
| `width` | `number | string` | - | Column width |

### TableAction<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | **Required.** Action label |
| `icon` | `ReactNode` | - | Action icon |
| `onClick` | `(record: T) => void` | - | **Required.** Click handler |
| `color` | `string` | `"blue"` | Mantine color |
| `variant` | `'filled' | 'outline' | 'light' | 'subtle'` | `"subtle"` | Button variant |

## Advanced Examples

### Custom Column Rendering

```tsx
const columns: TableColumn<Employee>[] = [
  {
    key: 'salary',
    title: 'Salary',
    accessor: 'salaryRate',
    render: (employee) => (
      <Text fw={500} c="green">
        ${employee.salaryRate}/hr
      </Text>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (employee) => (
      <Badge 
        color={employee.active ? 'green' : 'red'}
        variant="light"
      >
        {employee.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
```

### Multiple Actions

```tsx
const actions: TableAction<Employee>[] = [
  {
    label: 'View',
    icon: <IconEye size={16} />,
    onClick: (employee) => openModal(employee),
    color: 'blue',
    variant: 'light',
  },
  {
    label: 'Edit',
    icon: <IconEdit size={16} />,
    onClick: (employee) => router.push(`/edit/${employee.id}`),
    color: 'orange',
    variant: 'light',
  },
  {
    label: 'Delete',
    icon: <IconTrash size={16} />,
    onClick: (employee) => handleDelete(employee),
    color: 'red',
    variant: 'light',
  },
];
```

### Custom Filters

```tsx
const customFilters = (
  <Group>
    <Select
      placeholder="Department"
      data={departments}
      value={departmentFilter}
      onChange={setDepartmentFilter}
    />
    <DateInput
      placeholder="Start Date"
      value={startDate}
      onChange={setStartDate}
    />
  </Group>
);

<TableLayout
  // ... other props
  customFilters={customFilters}
/>
```

## Firestore Integration

The component automatically handles:

- **Querying**: Efficient queries with proper indexing
- **Pagination**: Cursor-based pagination for large datasets
- **Search**: Full-text search on specified fields
- **Sorting**: Server-side sorting by any field
- **Real-time**: Optional real-time updates (can be extended)

### Required Firestore Indexes

For optimal performance, create compound indexes in Firestore:

```javascript
// Example indexes for employees collection
{
  collection: "employees",
  fields: [
    { fieldPath: "name", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "DESCENDING" }
  ]
}
```

## Performance Tips

1. **Limit page size**: Keep `pageSize` reasonable (10-50 records)
2. **Index frequently sorted fields**: Create Firestore indexes
3. **Optimize renders**: Use `React.memo` for custom render functions
4. **Debounced search**: Search is already debounced (300ms)

## Troubleshooting

### Common Issues

1. **Missing Firestore indexes**: Check browser console for index creation URLs
2. **Permission denied**: Ensure Firestore security rules allow reads
3. **Type errors**: Ensure your data type `T` matches column accessors

### Firebase Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Migration from Existing Tables

To migrate existing table components:

1. Replace table component with `TableLayout`
2. Convert columns to `TableColumn[]` format
3. Move actions to `TableAction[]` format
4. Replace API calls with Firestore collection name
5. Update styling with Mantine components

## Extending the Component

The TableLayout can be extended for specific use cases:

```tsx
// Custom Employee Table with additional features
function EmployeeTableExtended() {
  const [filters, setFilters] = useState({});
  
  const handleExport = () => {
    // Export logic
  };
  
  return (
    <Stack>
      <Group justify="space-between">
        <Title>Employees</Title>
        <Button onClick={handleExport}>
          Export CSV
        </Button>
      </Group>
      
      <TableLayout<Employee>
        collectionName="employees"
        columns={columns}
        actions={actions}
        customFilters={<CustomFilters onChange={setFilters} />}
      />
    </Stack>
  );
}
```
