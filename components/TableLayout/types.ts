import { ReactNode } from 'react';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  accessor?: string;
  render?: (record: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  color?: string;
  variant?: 'filled' | 'outline' | 'light' | 'subtle';
}

export interface TableLayoutProps<T = any> {
  // Firestore configuration
  collectionName: string;

  // Table configuration
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];

  // Features
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;

  // Pagination
  pageSize?: number;

  // Styling
  title?: string;
  description?: string;

  // Callbacks
  onRowClick?: (record: T) => void;
  onAdd?: () => void;

  // Custom filters
  customFilters?: ReactNode;

  // Loading and error states
  emptyStateText?: string;
}
