import { BaseDocument } from './core';
import type { BusinessType } from './core';
import type { ModuleSettings } from './modules';
import type { Employee } from './core';

/**
 * Database Schema Types
 * 
 * These types represent the actual structure of the Firestore database collections.
 * They extend the base domain types with additional fields needed for the database.
 * 
 * FIRESTORE COLLECTION STRUCTURE:
 * 
 * - users
 * - businesses
 *   - {businessId}
 *     - employees
 *     - products
 *     - categories
 *     - suppliers
 *     - customers
 *     - transactions
 *     - orders
 *     - financial_records
 *     - module_enablements
 */

// Import the Timestamp type from Firestore
import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

/**
 * Base document type for all Firestore documents
 * 
 * This interface represents the structure of every document in Firestore.
 * All collection interfaces should extend this.
 */
export interface FirestoreDocument {
  id: string;                      // Document ID - not stored in document
  created_at: FirestoreTimestamp;  // Creation timestamp from serverTimestamp()
  updated_at: FirestoreTimestamp;  // Last update timestamp from serverTimestamp()
  is_active: boolean;              // Soft delete flag (preferred over hard deletion)
}

/**
 * User Collection - /users/{userId}
 * 
 * Stores user profiles and business associations.
 * The document ID typically matches the Firebase Auth UID.
 */
export interface UserDocument extends FirestoreDocument {
  uid: string;                     // Firebase Auth UID (matches document ID)
  email: string;                   // User's email address
  full_name: string;               // User's full name
  phone?: string;                  // Optional phone number
  avatar_url?: string;             // Profile image URL
  last_login?: FirestoreTimestamp; // Last login timestamp
  businesses: string[];            // Array of business IDs the user has access to
  default_business_id?: string;    // Default business to load
  fcm_tokens?: string[];           // Firebase Cloud Messaging tokens
  preferences?: Record<string, any>; // User preferences as key-value pairs
}

/**
 * Business Collection - /businesses/{businessId}
 * 
 * Stores business profiles and settings.
 * Each business has subcollections for various business entities.
 */
export interface BusinessDocument extends FirestoreDocument {
  owner_uid: string;                     // UID of the business owner (from Firebase Auth)
  business_name: string;                 // Name of the business
  business_type: BusinessType;           // Type of business (f&b, retail, service)
  address?: string;                      // Physical address
  phone?: string;                        // Contact phone number
  tax_number?: string;                   // Tax registration number
  tax_rate?: number;                     // Default tax rate
  currency?: string;                     // ISO currency code (USD, EUR, etc.)
  timezone?: string;                     // IANA timezone identifier
  enabled_modules: string[];             // IDs of enabled modules
  module_settings: Partial<ModuleSettings>; // Module-specific settings
  
  // Additional Firestore-optimized fields
  search_terms?: string[];              // Array of searchable terms (lowercase business name, etc.)
  subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled';
  subscription_end_date?: FirestoreTimestamp;
  locations?: Array<{                   // For businesses with multiple locations
    id: string;
    name: string;
    address: string;
    is_primary: boolean;
  }>;
}

// Module Collection
export interface ModuleDocument extends FirestoreDocument {
  name: string;
  description: string;
  category: 'core' | 'f&b' | 'retail' | 'service' | 'universal';
  dependencies: string[];
  pricing_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  icon: string;
  features: string[];
}

// Module Enablement Collection
export interface ModuleEnablementDocument extends FirestoreDocument {
  business_id: string;
  module_id: string;
  module_config: Record<string, any>;
  enabled_at: FirestoreTimestamp;
  disabled_at?: FirestoreTimestamp | null;
}

// Employee Collection
export interface EmployeeDocument extends FirestoreDocument {
  business_id: string;
  user_uid: string; // Reference to user account
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  permissions: string[];
  hourly_rate?: number;
  position?: string;
  assigned_shift?: string;
  dob?: string;
  address?: string;
  pin_code?: string;
}

// Category Collection
export interface CategoryDocument extends FirestoreDocument {
  business_id: string;
  name: string;
  description?: string;
  color_code?: string;
  sort_order: number;
  parent_id?: string;
  image_url?: string;
}

// Product Collection
export interface ProductDocument extends FirestoreDocument {
  business_id: string;
  category_id?: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  unit: string;
  images: string[];
  is_featured?: boolean;
  is_discountable?: boolean;
  
  // Module-specific product data
  variants?: {
    attribute_types: string[];
    variants: Array<{
      id: string;
      sku: string;
      attributes: Record<string, string>;
      price_adjustment: number;
      stock_quantity: number;
      images?: string[];
    }>;
  };
  
  recipe_data?: {
    ingredients: Array<{
      ingredient_id?: string;
      name: string;
      quantity: number;
      unit: string;
      cost?: number;
    }>;
    preparation_time?: number;
    cooking_time?: number;
    instructions?: string;
    portion_size?: number;
    portion_unit?: string;
  };
  
  seasonal_pricing?: Array<{
    name: string;
    price: number;
    start_date: FirestoreTimestamp;
    end_date: FirestoreTimestamp;
    active: boolean;
  }>;
}

// Supplier Collection
export interface SupplierDocument extends FirestoreDocument {
  business_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  payment_terms?: string;
  notes?: string;
  products?: string[];
}

// Customer Collection
export interface CustomerDocument extends FirestoreDocument {
  business_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points?: number;
  notes?: string;
  date_of_birth?: string;
  group?: string;
  total_spent: number;
  average_order: number;
  last_visit?: FirestoreTimestamp;
  visit_count: number;
}

// Transaction Collection
export interface TransactionDocument extends FirestoreDocument {
  business_id: string;
  transaction_number: string;
  customer_id?: string;
  employee_id: string;
  transaction_type: 'sale' | 'refund' | 'void';
  
  payment_method: string;
  payment_status: 'paid' | 'partial' | 'pending' | 'failed';
  payment_details?: {
    cash_amount?: number;
    card_amount?: number;
    card_type?: string;
    card_last_four?: string;
    mobile_payment_provider?: string;
    reference_number?: string;
    authorization_code?: string;
  };
  
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  tip_amount?: number;
  total_amount: number;
  change_amount?: number;
  
  location_id?: string;
  register_id?: string;
  
  line_items: Array<{
    id: string;
    product_id: string;
    variant_id?: string;
    name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    discount_rate?: number;
    discount_amount?: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    notes?: string;
    modifiers?: Array<{
      name: string;
      price_adjustment: number;
      quantity: number;
    }>;
    returned_quantity?: number;
    created_at: FirestoreTimestamp;
  }>;
  
  notes?: string;
  receipt_printed: boolean;
  receipt_emailed: boolean;
  receipt_number?: string;
}

// Financial Records Collection
export interface FinancialRecordDocument extends FirestoreDocument {
  business_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description?: string;
  date: FirestoreTimestamp;
  reference_number?: string;
  account_id: string;
  transaction_id?: string;
  payment_method?: string;
  tax_deductible?: boolean;
  receipt_url?: string;
  entered_by: string;
}

/**
 * Database Operations Types
 */

// Query options for Firestore
export interface FirestoreQueryOptions {
  filters?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
    value: any;
  }[];
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
  limit?: number;
  startAfter?: any;
}

// Initialization Results
export interface InitializationResult {
  success: boolean;
  businessId: string;
  error?: string;
}

// Business Template Data
export interface BusinessTemplateData {
  name: string;
  description: string;
  business_type: BusinessType;
  categories: Array<{
    name: string;
    description: string;
    color_code: string;
  }>;
  products: Array<{
    name: string;
    price: number;
    cost_price: number;
    stock_quantity: number;
    unit: string;
    category_index: number;
    recipe_data?: {
      ingredients: Array<{
        name: string;
        quantity: number;
        unit: string;
      }>;
    };
    variants?: {
      sizes?: string[];
      colors?: string[];
    };
  }>;
  suppliers?: Array<{
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    payment_terms: string;
  }>;
  module_settings: Partial<ModuleSettings>;
}
