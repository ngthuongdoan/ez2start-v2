import { BaseDocument } from "./core";

/**
 * Module & Marketplace Related Types
 */

// Module Types
export type ModuleCategory = 'core' | 'f&b' | 'retail' | 'service' | 'universal';

export interface Module extends BaseDocument {
  module_id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  dependencies: string[]; // IDs of required modules
  pricing_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  icon: string; // Icon for the module
  features: string[]; // List of features in this module
}

// Module Enablement Record
export interface ModuleEnablement extends BaseDocument {
  business_id: string;
  module_id: string;
  module_config: Record<string, any>; // Dynamic configuration based on module
  enabled_at: Date;
  disabled_at?: Date | null;
}

// Module Settings
export interface CoreSettings {
  business: {
    allow_multi_location: boolean;
    tax_inclusive_pricing: boolean;
  };
  pos: {
    tax_inclusive: boolean;
    auto_print: boolean;
    quick_items: string[]; // Product IDs for quick access
    payment_methods: ('cash' | 'card' | 'mobile' | 'credit' | string)[];
  };
  inventory: {
    low_stock_alerts: boolean;
    auto_reorder: boolean;
    default_unit: string;
  };
}

// F&B Specific Settings
export interface FnBSettings {
  recipes?: {
    cost_tracking: boolean;
    portion_control: boolean;
    ingredient_warnings: boolean;
  };
  tables?: {
    max_tables: number;
    table_layout: Record<string, any>; // Table layout configuration
    table_numbering: string;
  };
  kitchen?: {
    display_enabled: boolean;
    preparation_times: boolean;
    ticket_printing: boolean;
  };
}

// Retail Specific Settings
export interface RetailSettings {
  variants?: {
    max_variants: number;
    variant_types: string[];
    grid_view: boolean;
  };
  lookbook?: {
    max_images: number;
    auto_optimize: boolean;
  };
  seasonal?: {
    collections_enabled: boolean;
    promotional_pricing: boolean;
  };
}

// Service Business Settings
export interface ServiceSettings {
  appointments?: {
    booking_window: number; // Days in advance
    reminder_enabled: boolean;
    allow_online_booking: boolean;
    buffer_time: number; // Minutes between appointments
  };
  staff?: {
    service_assignments: boolean;
    commission_tracking: boolean;
  };
}

// Universal Settings (available to all business types)
export interface UniversalSettings {
  customers?: {
    loyalty_program: boolean;
    review_requests: boolean;
    customer_profiles: boolean;
  };
  analytics?: {
    advanced_reporting: boolean;
    export_formats: string[];
  };
  marketing?: {
    email_campaigns: boolean;
    sms_enabled: boolean;
    automation_rules: boolean;
  };
}

// Combined Settings Type
export interface ModuleSettings extends 
  CoreSettings,
  Partial<FnBSettings>,
  Partial<RetailSettings>,
  Partial<ServiceSettings>,
  Partial<UniversalSettings> {
}

// Business Templates for Quick Setup
export interface BusinessTemplate extends BaseDocument {
  name: string;
  description: string;
  business_type: string;
  categories: CategoryTemplate[];
  products: ProductTemplate[];
  suppliers?: SupplierTemplate[];
  module_settings: Partial<ModuleSettings>;
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
  category_index: number; // Reference to index in categories array
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

export interface RecipeData {
  ingredients?: RecipeIngredient[];
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface ProductVariants {
  sizes?: string[];
  colors?: string[];
}
