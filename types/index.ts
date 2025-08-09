/**
 * Types Index
 * 
 * This file exports all types from the various type files for easy importing.
 */

// Basic Types
export type Id = string | number;

// Core Types
export * from './core';

// Module & Marketplace Types
export * from './modules';

// Inventory Types - maintain backward compatibility
export * from './inventory';

// Import new inventory types with prefixes to avoid conflicts
import * as InventoryV2 from './inventory-v2';
export { InventoryV2 };

// POS Types
export * from './pos';

// Employee Management Types
import * as EmployeeTypes from './employees';
export { EmployeeTypes };

// Financial Management Types
export * from './financial';

// Database Schema Types
export * from './schema';

// Legacy Types (maintain backward compatibility)
export type KanbanColumn = {
  id: Id;
  title: string;
  tasks?: KanbanTask[];
};

export type KanbanTask = {
  id: Id;
  columnId: Id;
  content: string;
  title?: string;
  status?: 'to do' | 'in progress' | 'done' | 'unassigned' | string;
  comments?: number;
  users?: number;
};

export type OrderStatus = 'shipped' | 'processing' | 'cancelled' | string;

export type Orders = {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
};

export type InvoiceStatus =
  | 'pending'
  | 'sent'
  | 'cancelled'
  | 'approved'
  | 'suspended'
  | string;

export type Invoices = {
  id: string;
  full_name: string;
  email: string;
  address: string;
  country: string;
  status: InvoiceStatus;
  amount: number;
  issue_date: string;
  description: string;
  client_email: string;
  client_address: string;
  client_country: string;
  client_name: string;
  client_company: string;
};
