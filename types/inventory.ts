// Inventory Management Types

export interface Category {
  id?: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id?: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  tax_id?: string;
  payment_terms?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: string;
  name: string;
  sku: string;
  description?: string;
  category_id?: string;
  category?: Category;
  brand?: string;
  unit: string; // e.g., 'piece', 'kg', 'liter'
  cost_price: number;
  selling_price: number;
  min_stock_level: number;
  max_stock_level?: number;
  barcode?: string;
  image_url?: string;
  status: 'active' | 'discontinued';
  created_at?: string;
  updated_at?: string;
}

export interface StockMovement {
  id?: string;
  product_id: string;
  product?: Product;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_cost?: number;
  reference_type?: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'return';
  reference_id?: string;
  supplier_id?: string;
  supplier?: Supplier;
  location?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
}

export interface Stock {
  id?: string;
  product_id: string;
  product?: Product;
  quantity_available: number;
  quantity_reserved: number;
  quantity_total: number;
  location?: string;
  last_updated?: string;
}

export interface StockAlert {
  id?: string;
  product_id: string;
  product?: Product;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  current_quantity: number;
  threshold_quantity: number;
  status: 'active' | 'resolved';
  created_at?: string;
}

// Dashboard/Report Types
export interface InventoryStats {
  total_products: number;
  total_categories: number;
  total_suppliers: number;
  low_stock_alerts: number;
  out_of_stock_products: number;
  total_inventory_value: number;
  recent_movements: StockMovement[];
}

export interface InventoryReport {
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock_level: number;
  stock_status: 'good' | 'low' | 'critical' | 'out';
  last_movement_date?: string;
  inventory_value: number;
}

// Form Types
export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  category_id?: string;
  brand?: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  min_stock_level: number;
  max_stock_level?: number;
  barcode?: string;
  status: 'active' | 'discontinued';
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  tax_id?: string;
  payment_terms?: string;
  status: 'active' | 'inactive';
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface StockAdjustmentFormData {
  product_id: string;
  adjustment_type: 'increase' | 'decrease' | 'set';
  quantity: number;
  unit_cost?: number;
  reason: string;
  notes?: string;
}
