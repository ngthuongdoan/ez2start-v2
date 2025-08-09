/**
 * Base Types
 * These types represent the foundational structures used across the application
 */

// Base types for all documents
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

/**
 * Base document interface for Firestore documents
 * 
 * This is the core type that all document types should extend.
 * It includes the essential fields for Firestore document tracking.
 */
export interface BaseDocument {
  id: string; // Unique document ID (Firestore)
  created_at: Timestamp;
  updated_at: Timestamp;
  is_active: boolean;
}

/**
 * Type for creating a new document (without id and timestamps)
 * This is useful for operations where you need to create a new document
 */
export type CreateDocument<T extends BaseDocument> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type for updating an existing document
 * This makes all fields optional except id for partial updates
 */
export type UpdateDocument<T extends BaseDocument> = Partial<Omit<T, 'id' | 'created_at'>> & { id: string };

// Business Types
export type BusinessType = 'f&b' | 'retail' | 'service';

/**
 * Business document type
 * Core business entity that stores the main business profile
 */
export interface Business extends BaseDocument {
  owner_uid: string; // Reference to auth user
  business_name: string;
  business_type: BusinessType;
  address?: string;
  phone?: string;
  tax_number?: string;
  tax_rate?: number;
  currency?: string;
  timezone?: string;
  enabled_modules: string[]; // References to module IDs
  settings?: Record<string, any>; // For flexible settings storage
}

/**
 * User document type
 * Represents a user in the system with authentication and business access
 */
export interface User extends BaseDocument {
  uid: string; // Firebase Auth UID
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  last_login?: Timestamp;
  businesses: string[]; // IDs of businesses the user has access to
  default_business_id?: string; // Default business to load
  preferences?: Record<string, any>; // User preferences as flexible key-value pairs
  fcm_tokens?: string[]; // Firebase Cloud Messaging tokens for notifications
}

/**
 * Employee roles with strong typing
 * Standard roles that are used across the application
 */
export type EmployeeRole = 'owner' | 'manager' | 'staff' | 'cashier' | 'custom';

/**
 * Employee document type
 * Represents an employee within a business
 */
export interface Employee extends BaseDocument {
  business_id: string; // Reference to business
  user_uid: string; // Reference to user account
  full_name: string;
  email: string;
  phone?: string;
  role: EmployeeRole | string;
  permissions: string[]; // Array of permission keys
  hourly_rate?: number;
  position?: string;
  assigned_shift?: string;
  dob?: string;
  address?: string;
  pin_code?: string; // For POS quick login
  metadata?: Record<string, any>; // Additional employee data that might be business-specific
}

/**
 * Authentication and API Types
 * These are not stored directly in Firestore but used for API interactions
 */

// Authentication request type
export interface AuthRequest {
  email: string;
  password: string;
}

// Signup request extending auth request
export interface SignupRequest extends AuthRequest {
  full_name: string;
  business_name: string;
  business_type: BusinessType;
}

// Authentication response 
export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    full_name: string;
  };
  token: string;
  refresh_token?: string; // For JWT refresh capability
  business_id?: string;
  expires_at?: number; // Timestamp for token expiration
}

/**
 * Firestore helper types for SDK operations
 */

// Type to handle Firestore document snapshots
export type WithDocRef<T> = T & {
  docRef?: string; // Document reference path
}

// Type for Firestore batch operations
export interface BatchOperation<T extends BaseDocument> {
  operation: 'create' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data?: Partial<T>;
}
