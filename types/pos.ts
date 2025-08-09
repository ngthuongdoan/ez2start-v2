import { BaseDocument } from "./core";

/**
 * POS (Point of Sale) Related Types
 */

// Sales/Transaction Types
export interface Transaction extends BaseDocument {
  business_id: string;
  transaction_number: string; // Human-readable transaction ID
  customer_id?: string; // Optional customer reference
  employee_id: string; // Employee who processed the transaction
  transaction_type: 'sale' | 'refund' | 'void';
  
  // Payment details
  payment_method: 'cash' | 'card' | 'mobile' | 'credit' | 'split' | string;
  payment_status: 'paid' | 'partial' | 'pending' | 'failed';
  payment_details?: PaymentDetails;
  
  // Financial data
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  tip_amount?: number;
  total_amount: number;
  change_amount?: number; // For cash transactions
  
  // Location information
  location_id?: string;
  register_id?: string;
  
  // Items in transaction
  line_items: LineItem[];
  
  // Additional fields
  notes?: string;
  receipt_printed: boolean;
  receipt_emailed: boolean;
  receipt_number?: string;
}

export interface PaymentDetails {
  cash_amount?: number;
  card_amount?: number;
  card_type?: string; // visa, mastercard, etc.
  card_last_four?: string;
  mobile_payment_provider?: string; // e.g. Apple Pay, Google Pay
  reference_number?: string; // Transaction reference from payment processor
  authorization_code?: string;
}

export interface LineItem extends BaseDocument {
  transaction_id: string;
  product_id: string;
  variant_id?: string;
  name: string; // Stored at time of sale to preserve history
  sku: string;
  quantity: number;
  unit_price: number;
  discount_rate?: number; // Percentage discount
  discount_amount?: number; // Fixed amount discount
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  modifiers?: LineItemModifier[]; // For custom additions
  returned_quantity?: number; // For partial returns
}

export interface LineItemModifier {
  name: string;
  price_adjustment: number;
  quantity: number;
}

// Customer Types
export interface Customer extends BaseDocument {
  business_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points?: number;
  notes?: string;
  date_of_birth?: string;
  group?: string; // For customer segmentation
  total_spent: number;
  average_order: number;
  last_visit?: Date;
  visit_count: number;
}

// Order Types (for table service, future orders)
export interface Order extends BaseDocument {
  business_id: string;
  order_number: string; // Human-readable order ID
  order_type: 'dine-in' | 'takeout' | 'delivery' | 'online';
  customer_id?: string;
  employee_id: string;
  
  // For restaurants
  table_number?: string;
  covers?: number; // Number of guests
  
  status: 'new' | 'in-progress' | 'ready' | 'completed' | 'cancelled';
  
  // Items in order
  line_items: LineItem[];
  
  // Financial data
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  service_charge?: number;
  total_amount: number;
  
  // Additional fields
  notes?: string;
  preparation_time?: number; // Estimated time in minutes
  scheduled_for?: Date; // For future orders
}

// For table management (F&B)
export interface Table extends BaseDocument {
  business_id: string;
  table_number: string;
  name?: string;
  capacity: number;
  shape: 'round' | 'square' | 'rectangle' | 'custom';
  position?: { x: number, y: number }; // For visual layout
  width?: number;
  height?: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  current_order_id?: string;
  server_id?: string; // Employee assigned to table
}

// Reservation Types (F&B)
export interface Reservation extends BaseDocument {
  business_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  table_id?: string;
  table_number?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM in 24h format
  duration: number; // In minutes
  party_size: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  special_requests?: string;
}

// Form Data Types
export interface OrderFormData {
  order_type: 'dine-in' | 'takeout' | 'delivery' | 'online';
  customer_id?: string;
  table_number?: string;
  covers?: number;
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    notes?: string;
    modifiers?: {
      name: string;
      price: number;
      quantity: number;
    }[];
  }[];
  notes?: string;
  scheduled_for?: Date;
}

export interface TableFormData {
  table_number: string;
  name?: string;
  capacity: number;
  shape: 'round' | 'square' | 'rectangle' | 'custom';
  position?: { x: number, y: number };
  width?: number;
  height?: number;
}

export interface ReservationFormData {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  table_id?: string;
  date: string;
  time: string;
  duration: number;
  party_size: number;
  notes?: string;
  special_requests?: string;
}
