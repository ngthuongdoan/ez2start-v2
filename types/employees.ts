import { BaseDocument } from "./core";

/**
 * Employee Management Types
 */

// Employee roles and permissions
export type EmployeeRole = 'owner' | 'manager' | 'staff' | 'cashier' | 'custom';

export interface Role extends BaseDocument {
  business_id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  is_system_role: boolean; // True for default roles that cannot be deleted
}

export interface Permission {
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve';
  resource: string;
}

// Shift & Schedule Management
export interface Shift extends BaseDocument {
  business_id: string;
  name: string;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  color: string; // For visual identification in schedule
  is_overnight: boolean; // Shift crosses midnight
  break_duration?: number; // In minutes
}

export interface ScheduleEntry extends BaseDocument {
  business_id: string;
  employee_id: string;
  shift_id: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'missed';
  is_published: boolean; // Whether schedule has been published to employees
}

// Time tracking
export interface TimeEntry extends BaseDocument {
  business_id: string;
  employee_id: string;
  clock_in: Date;
  clock_out?: Date;
  break_start?: Date[];
  break_end?: Date[];
  total_hours?: number; // Calculated on clock-out
  total_break_minutes?: number;
  notes?: string;
  approved_by?: string; // Manager who approved entry
  approved_at?: Date;
  status: 'active' | 'completed' | 'modified' | 'approved';
}

// Form Data Types
export interface EmployeeFormData {
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  permissions?: string[];
  hourly_rate?: number;
  position?: string;
  dob?: string;
  address?: string;
  pin_code?: string;
  assigned_shift?: string;
}

export interface RoleFormData {
  name: string;
  description?: string;
  permissions: {
    module: string;
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve';
    resource: string;
  }[];
}

export interface ShiftFormData {
  name: string;
  start_time: string;
  end_time: string;
  color: string;
  break_duration?: number;
}

export interface ScheduleFormData {
  employee_id: string;
  shift_id: string;
  date: string;
  notes?: string;
}
