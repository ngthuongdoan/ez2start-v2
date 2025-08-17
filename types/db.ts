import { serverTimestamp } from "firebase/firestore";

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

export interface BusinessDocument {
  business_id: string;
  owner_uid: string;
  business_name: string;
  business_type: string;
  address: string;
  phone: string;
  tax_number: string;
  tax_rate: number;
  currency: string;
  timezone: string;
  enabled_modules: string[];
  module_settings: ModuleSettings;
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
  is_active: boolean;
}

export interface EmployeeDocument {
  employee_id: string;
  business_id: string;
  user_uid: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  hourly_rate: number;
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
  is_active: boolean;
}

export interface CategoryDocument {
  category_id: string;
  business_id: string;
  name: string;
  description: string;
  color_code: string;
  sort_order: number;
  created_at: ReturnType<typeof serverTimestamp>;
  updated_at: ReturnType<typeof serverTimestamp>;
  is_active: boolean;
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