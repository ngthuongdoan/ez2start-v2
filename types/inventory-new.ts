import { BaseDocument } from "./core";

/**
 * Inventory Management Types
 */

// Category Model
export interface Category extends BaseDocument {
  business_id: string;
  name: string;
  description?: string;
  color_code?: string;
  sort_order: number;
  parent_id?: string; // For nested categories
  image_url?: string;
}

// Product Model
export interface Product extends BaseDocument {
  business_id: string;
  category_id?: string; // Reference to category
  name: string;
  description?: string;
  sku: string; // Stock Keeping Unit
  barcode?: string;
  price: number; // Selling price
  cost_price: number; // Cost price for profit calculation
  stock_quantity: number;
  min_stock_level: number; // Threshold for low stock alerts
  max_stock_level?: number; // Optional maximum stock level
  unit: string; // e.g., 'piece', 'kg', 'liter'
  images: string[]; // Array of image URLs
  is_featured?: boolean; // Product should be featured in store/menu
  is_discountable?: boolean; // Whether product can be discounted
  
  // Module-specific product data
  variants?: ProductVariants;
  recipe_data?: RecipeData;
  seasonal_pricing?: SeasonalPricing[];
  tax_category?: string;
  weight?: number; // For shipping calculations
  dimensions?: ProductDimensions;
}

// Product Variant System
export interface ProductVariant extends BaseDocument {
  product_id: string;
  sku: string;
  barcode?: string;
  attributes: Record<string, string>; // e.g., {"size": "M", "color": "Blue"}
  price_adjustment: number; // Amount to add to base price
  stock_quantity: number;
  images?: string[];
}

export interface ProductVariants {
  attribute_types: string[]; // ["size", "color"]
  variants: ProductVariant[];
}

// For retail products
export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string; // cm, inch, etc.
}

// For seasonal pricing
export interface SeasonalPricing {
  name: string; // e.g., "Summer Sale"
  price: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
}

// Recipe Management (for F&B)
export interface RecipeIngredient {
  ingredient_id?: string; // Optional reference to ingredient product
  name: string;
  quantity: number;
  unit: string;
  cost?: number; // Per unit cost
}

export interface RecipeData {
  ingredients: RecipeIngredient[];
  preparation_time?: number; // In minutes
  cooking_time?: number; // In minutes
  instructions?: string;
  portion_size?: number;
  portion_unit?: string;
}

// Supplier Management
export interface Supplier extends BaseDocument {
  business_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  payment_terms?: string; // e.g., "Net 30"
  notes?: string;
  products?: string[]; // Product IDs supplied by this supplier
}

// Stock Movements
export interface StockMovement extends BaseDocument {
  business_id: string;
  product_id: string;
  variant_id?: string; // Optional reference to specific variant
  movement_type: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'return';
  quantity: number; // Positive for in, negative for out
  unit_cost?: number; // Cost at time of movement
  supplier_id?: string; // For purchases
  order_id?: string; // Reference to sale/purchase order
  location_id?: string; // For multi-location businesses
  notes?: string;
  performed_by: string; // Employee ID who performed the action
}

// Stock Alerts
export interface StockAlert extends BaseDocument {
  business_id: string;
  product_id: string;
  variant_id?: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  current_quantity: number;
  threshold_quantity: number;
  status: 'active' | 'resolved';
  resolved_at?: Date;
}

// Inventory Form Data Types
export interface ProductFormData {
  name: string;
  description?: string;
  category_id?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  unit: string;
  images?: File[] | string[];
  is_featured?: boolean;
  variants?: {
    attribute_types: string[];
    variants: {
      attributes: Record<string, string>;
      price_adjustment: number;
      stock_quantity: number;
      sku: string;
    }[];
  };
  recipe_data?: {
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[];
  };
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  payment_terms?: string;
  notes?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color_code?: string;
  parent_id?: string;
  image?: File | string;
}

export interface StockAdjustmentFormData {
  product_id: string;
  variant_id?: string;
  adjustment_type: 'increase' | 'decrease' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}
