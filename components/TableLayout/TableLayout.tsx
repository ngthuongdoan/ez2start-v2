'use client';

import {
  ActionIcon,
  Box,
  Button,
  Group,
  Menu,
  Pagination,
  Paper,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconDots, IconPlus, IconRefresh, IconSearch } from '@tabler/icons-react';
import { DocumentSnapshot } from 'firebase/firestore';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

import { FirestoreQueryOptions, FirestoreService } from './firestoreService';
import { TableLayoutProps } from './types';

export function TableLayout<T extends Record<string, any>>({
  collectionName,
  columns,
  actions = [],
  searchable = true,
  filterable = true,
  sortable = true,
  pageSize = 25,
  title,
  description,
  onRowClick,
  onAdd,
  customFilters,
  emptyStateText = 'No data found'
}: TableLayoutProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [sortStatus, setSortStatus] = useState<{ columnAccessor: string; direction: 'asc' | 'desc' } | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastDocs, setLastDocs] = useState<DocumentSnapshot[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Convert TableColumn to DataTableColumn
  const tableColumns: DataTableColumn<T>[] = useMemo(() => {
    const cols = columns.map(column => ({
      accessor: column.accessor || column.key,
      title: column.title,
      sortable: sortable && column.sortable !== false,
      width: column.width,
      render: column.render
    }));

    // Add actions column if actions are provided
    if (actions.length > 0) {
      cols.push({
        accessor: 'actions',
        title: 'Actions',
        width: actions.length > 2 ? 120 : actions.length * 60,
        render: (record: T) => (
          <Group gap="xs">
            {actions.slice(0, 2).map((action, index) => (
              <ActionIcon
                key={index}
                size="sm"
                variant={action.variant || 'subtle'}
                color={action.color || 'blue'}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(record);
                } }
              >
                {action.icon}
              </ActionIcon>
            ))}
            {actions.length > 2 && (
              <Menu>
                <Menu.Target>
                  <ActionIcon size="sm" variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {actions.slice(2).map((action, index) => (
                    <Menu.Item
                      key={index + 2}
                      leftSection={action.icon}
                      onClick={() => action.onClick(record)}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        ),
        sortable: false
      });
    }

    return cols;
  }, [columns, actions, sortable]);

  // Get search fields from columns
  const searchFields = useMemo(() => 
    columns.filter(col => col.filterable !== false).map(col => col.accessor || col.key),
    [columns]
  );

  // Fetch data function
  const fetchData = async (page = 1, resetData = false) => {
    setLoading(true);
    try {
      const options: FirestoreQueryOptions = {
        searchQuery: debouncedSearchQuery,
        searchFields,
        sortField: sortStatus?.columnAccessor || 'createdAt',
        sortDirection: sortStatus?.direction || 'desc',
        pageSize,
        filters,
        lastDoc: page > 1 ? lastDocs[page - 2] : undefined
      };

      const result = await FirestoreService.getDocuments<T>(collectionName, options);
      
      if (resetData || page === 1) {
        setData(result.data);
        setLastDocs(result.lastDoc ? [result.lastDoc] : []);
      } else {
        setData(prev => [...prev, ...result.data]);
        setLastDocs(prev => [...prev, result.lastDoc!]);
      }
      
      setHasMore(result.hasMore);
      setCurrentPage(page);
      
      // Calculate total pages (approximate for Firestore)
      const estimatedTotal = Math.ceil((page * pageSize) / pageSize) + (result.hasMore ? 1 : 0);
      setTotalPages(estimatedTotal);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to refetch data when dependencies change
  useEffect(() => {
    fetchData(1, true);
  }, [debouncedSearchQuery, sortStatus, filters, collectionName]);

  // Handle sort change
  const handleSortStatusChange = (status: { columnAccessor: string & {} | keyof T; direction: 'asc' | 'desc' } | undefined) => {
    if (status) {
      setSortStatus({
        columnAccessor: typeof status.columnAccessor === 'string' ? status.columnAccessor : String(status.columnAccessor),
        direction: status.direction
      });
    } else {
      setSortStatus(undefined);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page <= lastDocs.length + 1) {
      fetchData(page);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchData(1, true);
  };

  return (
    <Paper p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            {title && <Title order={2}>{title}</Title>}
            {description && <Text c="dimmed">{description}</Text>}
          </Box>
          <Group>
            <ActionIcon onClick={handleRefresh} variant="light">
              <IconRefresh size={16} />
            </ActionIcon>
            {onAdd && (
              <Button leftSection={<IconPlus size={16} />} onClick={onAdd}>
                Add New
              </Button>
            )}
          </Group>
        </Group>

        {/* Filters and Search */}
        <Group>
          {searchable && (
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          )}
          {customFilters}
        </Group>

        {/* Data Table */}
        <DataTable
          columns={tableColumns}
          records={data}
          fetching={loading}
          onRowClick={onRowClick ? ({ record }) => onRowClick(record) : undefined}
          sortStatus={sortStatus ?? { columnAccessor: 'createdAt' as keyof T, direction: 'desc' }}
          onSortStatusChange={handleSortStatusChange}
          minHeight={400}
          noRecordsText={emptyStateText}
          highlightOnHover
          striped
        />

        {/* Pagination */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {data.length} records {hasMore && '(more available)'}
          </Text>
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={Math.max(totalPages, currentPage + (hasMore ? 1 : 0))}
            size="sm"
          />
        </Group>
      </Stack>
    </Paper>
  );
}