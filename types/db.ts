import { serverTimestamp } from "firebase/firestore";
import { Employee } from "./employee";
import { Category } from "./category";
import { Business } from "./business";

// Type definitions
export interface BusinessData {
  business_name: string;
  business_type: 'f&b' | 'retail' | 'service';
  address?: string;
  phone?: string;
  tax_number?: string;
  tax_rate?: number;
  currency?: string;
  timezone?: string;
  owner_name?: string;
  owner_email?: string;
}

export interface BusinessDocument extends Business {
  _id: string; // Firestore document ID
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
}

export interface EmployeeDocument extends Employee {
  _id: string; // Firestore document ID
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
}

export interface CategoryDocument extends Category {
  _id: string; // Firestore document ID
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
}
export interface ProductVariants {
  sizes?: string[];
  colors?: string[];
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeData {
  ingredients?: RecipeIngredient[];
}

export interface ProductDocument {
  product_id: string;
  business_id: string;
  category_id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  images: string[];
  variants: ProductVariants;
  recipe_data: RecipeData;
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
  is_active: boolean;
}

export interface SupplierDocument {
  supplier_id: string;
  business_id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  payment_terms: string;
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
  is_active: boolean;
}

export interface ModuleEnablement {
  id: string;
  business_id: string;
  module_id: string;
  module_config: Record<string, any>;
  enabled_at: ReturnType<typeof serverTimestamp>;
  disabled_at: null;
  is_active: boolean;
}

export interface ModuleSettings {
  pos: {
    tax_inclusive: boolean;
    auto_print: boolean;
  };
  inventory: {
    low_stock_alerts: boolean;
    auto_reorder: boolean;
  };
  recipes?: {
    cost_tracking: boolean;
    portion_control: boolean;
  };
  tables?: {
    max_tables: number;
    table_numbering: string;
  };
  variants?: {
    max_variants: number;
    variant_types: string[];
  };
  lookbook?: {
    max_images: number;
    auto_optimize: boolean;
  };
  appointments?: {
    booking_window: number;
    reminder_enabled: boolean;
  };
  customers?: {
    loyalty_program: boolean;
    review_requests: boolean;
  };
}

export interface CategoryTemplate {
  name: string;
  description: string;
  color_code: string;
}

export interface ProductTemplate {
  name: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  unit: string;
  category_index: number;
  recipe_data?: RecipeData;
  variants?: ProductVariants;
}

export interface SupplierTemplate {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  payment_terms: string;
}

export interface InitializationResult {
  success: boolean;
  businessId: string;
}