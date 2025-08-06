import {
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from "./firebase"
import { BusinessData, InitializationResult, BusinessDocument, EmployeeDocument, ModuleSettings, CategoryDocument, CategoryTemplate, ProductDocument, ProductTemplate, SupplierTemplate, SupplierDocument, ModuleEnablement } from '@/types/db';
/**
 * Initialize a new tenant with example data based on business type
 */
export async function initializeTenant(
  businessId: string,
  ownerUid: string,
  businessData: BusinessData
): Promise<InitializationResult> {
  const batch = writeBatch(db);

  try {
    // 1. Create Business Document
    const businessRef = doc(db, 'businesses', businessId);
    const businessDoc: BusinessDocument = {
      business_id: businessId,
      owner_uid: ownerUid,
      business_name: businessData.business_name,
      business_type: businessData.business_type,
      address: businessData.address || '',
      phone: businessData.phone || '',
      tax_number: businessData.tax_number || '',
      tax_rate: businessData.tax_rate || 0.06, // Default 6%
      currency: businessData.currency || 'USD',
      timezone: businessData.timezone || 'UTC',
      enabled_modules: getDefaultModules(businessData.business_type),
      module_settings: getDefaultModuleSettings(businessData.business_type),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      is_active: true
    };
    batch.set(businessRef, businessDoc);

    // 2. Create Owner Employee Record
    const ownerEmployeeRef = doc(db, 'employees', `${businessId}_owner`);
    const ownerEmployee: EmployeeDocument = {
      employee_id: `${businessId}_owner`,
      business_id: businessId,
      user_uid: ownerUid,
      full_name: businessData.owner_name || '',
      email: businessData.owner_email || '',
      phone: businessData.phone || '',
      role: 'owner',
      permissions: ['pos', 'inventory', 'reports', 'employees', 'settings'],
      hourly_rate: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      is_active: true
    };
    batch.set(ownerEmployeeRef, ownerEmployee);

    // 3. Create Example Categories
    const categories = getExampleCategories(businessData.business_type, businessId);
    categories.forEach((category, index) => {
      const categoryRef = doc(db, 'categories', `${businessId}_cat_${index + 1}`);
      batch.set(categoryRef, category);
    });

    // 4. Create Example Products
    const products = getExampleProducts(businessData.business_type, businessId, categories);
    products.forEach((product, index) => {
      const productRef = doc(db, 'products', `${businessId}_prod_${index + 1}`);
      batch.set(productRef, product);
    });

    // 5. Create Example Supplier
    const supplier = getExampleSupplier(businessData.business_type, businessId);
    const supplierRef = doc(db, 'suppliers', `${businessId}_supplier_1`);
    batch.set(supplierRef, supplier);

    // 6. Enable Default Modules
    const moduleEnablements = getModuleEnablements(businessId, businessData.business_type);
    moduleEnablements.forEach((module, index) => {
      const moduleRef = doc(db, 'business_modules', `${businessId}_module_${index + 1}`);
      batch.set(moduleRef, module);
    });

    // Commit all changes
    await batch.commit();

    console.log(`✅ Tenant ${businessId} initialized successfully`);
    return { success: true, businessId };

  } catch (error) {
    console.error('❌ Error initializing tenant:', error);
    throw error;
  }
}

/**
 * Get default modules based on business type
 */
function getDefaultModules(businessType: BusinessData['business_type']): string[] {
  const baseModules = ['pos', 'inventory', 'employees'];

  switch (businessType) {
    case 'f&b':
      return [...baseModules, 'recipes', 'tables'];
    case 'retail':
      return [...baseModules, 'variants', 'lookbook'];
    case 'service':
      return [...baseModules, 'appointments', 'customers'];
    default:
      return baseModules;
  }
}

/**
 * Get default module settings
 */
function getDefaultModuleSettings(businessType: BusinessData['business_type']): ModuleSettings {
  const baseSettings: ModuleSettings = {
    pos: { tax_inclusive: false, auto_print: true },
    inventory: { low_stock_alerts: true, auto_reorder: false }
  };

  const typeSpecificSettings: Record<BusinessData['business_type'], Partial<ModuleSettings>> = {
    "f&b": {
      recipes: { cost_tracking: true, portion_control: true },
      tables: { max_tables: 20, table_numbering: 'numeric' }
    },
    retail: {
      variants: { max_variants: 10, variant_types: ['size', 'color'] },
      lookbook: { max_images: 50, auto_optimize: true }
    },
    service: {
      appointments: { booking_window: 30, reminder_enabled: true },
      customers: { loyalty_program: false, review_requests: true }
    }
  };

  return { ...baseSettings, ...typeSpecificSettings[businessType] || {} };
}

/**
 * Get example categories based on business type
 */
function getExampleCategories(businessType: BusinessData['business_type'], businessId: string): CategoryDocument[] {
  const baseCategories: Record<BusinessData['business_type'], CategoryTemplate[]> = {
    "f&b": [
      { name: 'Beverages', description: 'Coffee, Tea, Juices', color_code: '#8B4513' },
      { name: 'Food', description: 'Pastries, Sandwiches, Meals', color_code: '#FF6B35' },
      { name: 'Desserts', description: 'Cakes, Cookies, Ice Cream', color_code: '#F7931E' }
    ],
    retail: [
      { name: 'Clothing', description: 'Shirts, Pants, Dresses', color_code: '#6C5CE7' },
      { name: 'Accessories', description: 'Bags, Jewelry, Watches', color_code: '#A29BFE' },
      { name: 'Footwear', description: 'Shoes, Sandals, Boots', color_code: '#74B9FF' }
    ],
    service: [
      { name: 'Basic Services', description: 'Standard service offerings', color_code: '#00B894' },
      { name: 'Premium Services', description: 'High-end service packages', color_code: '#00CEC9' },
      { name: 'Add-ons', description: 'Additional service options', color_code: '#55A3FF' }
    ]
  };

  const categories = baseCategories[businessType] || baseCategories.service;

  return categories.map((cat, index): CategoryDocument => ({
    category_id: `${businessId}_cat_${index + 1}`,
    business_id: businessId,
    name: cat.name,
    description: cat.description,
    color_code: cat.color_code,
    sort_order: index + 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    is_active: true
  }));
}

/**
 * Get example products based on business type
 */
function getExampleProducts(
  businessType: BusinessData['business_type'],
  businessId: string,
  categories: CategoryDocument[]
): ProductDocument[] {
  const productTemplates: Record<BusinessData['business_type'], ProductTemplate[]> = {
    "f&b": [
      {
        name: 'Espresso', price: 3.50, cost_price: 0.80, stock_quantity: 0,
        unit: 'cup', category_index: 0,
        recipe_data: { ingredients: [{ name: 'Coffee beans', quantity: 18, unit: 'g' }] }
      },
      {
        name: 'Croissant', price: 4.25, cost_price: 1.20, stock_quantity: 24,
        unit: 'pcs', category_index: 1,
        recipe_data: { ingredients: [{ name: 'Flour', quantity: 100, unit: 'g' }] }
      },
      {
        name: 'Chocolate Cake Slice', price: 6.50, cost_price: 2.10, stock_quantity: 8,
        unit: 'slice', category_index: 2,
        recipe_data: { ingredients: [{ name: 'Chocolate', quantity: 50, unit: 'g' }] }
      }
    ],
    retail: [
      {
        name: 'Basic T-Shirt', price: 24.99, cost_price: 8.50, stock_quantity: 50,
        unit: 'pcs', category_index: 0,
        variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Navy'] }
      },
      {
        name: 'Leather Handbag', price: 89.99, cost_price: 35.00, stock_quantity: 12,
        unit: 'pcs', category_index: 1,
        variants: { colors: ['Brown', 'Black', 'Tan'] }
      },
      {
        name: 'Running Shoes', price: 129.99, cost_price: 52.00, stock_quantity: 25,
        unit: 'pair', category_index: 2,
        variants: { sizes: ['7', '8', '9', '10', '11'], colors: ['White', 'Black', 'Red'] }
      }
    ],
    service: [
      {
        name: 'Basic Consultation', price: 75.00, cost_price: 0, stock_quantity: 0,
        unit: 'session', category_index: 0
      },
      {
        name: 'Premium Package', price: 199.99, cost_price: 0, stock_quantity: 0,
        unit: 'package', category_index: 1
      },
      {
        name: 'Additional Support', price: 25.00, cost_price: 0, stock_quantity: 0,
        unit: 'hour', category_index: 2
      }
    ]
  };

  const products = productTemplates[businessType] || productTemplates.service;

  return products.map((prod, index): ProductDocument => ({
    product_id: `${businessId}_prod_${index + 1}`,
    business_id: businessId,
    category_id: categories[prod.category_index].category_id,
    name: prod.name,
    description: `Example ${prod.name.toLowerCase()}`,
    sku: `SKU${String(index + 1).padStart(3, '0')}`,
    barcode: `${businessId}${String(index + 1).padStart(6, '0')}`,
    price: prod.price,
    cost_price: prod.cost_price,
    stock_quantity: prod.stock_quantity,
    min_stock_level: Math.max(1, Math.floor(prod.stock_quantity * 0.2)),
    unit: prod.unit,
    images: [],
    variants: prod.variants || {},
    recipe_data: prod.recipe_data || {},
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    is_active: true
  }));
}

/**
 * Get example supplier
 */
function getExampleSupplier(businessType: BusinessData['business_type'], businessId: string): SupplierDocument {
  const supplierTemplates: Record<BusinessData['business_type'], SupplierTemplate> = {
    "f&b": {
      name: 'Local Coffee Roasters',
      contact_person: 'John Smith',
      email: 'orders@localcoffee.com',
      phone: '+1-555-0123',
      payment_terms: 'Net 30'
    },
    retail: {
      name: 'Fashion Wholesale Co.',
      contact_person: 'Sarah Johnson',
      email: 'sales@fashionwholesale.com',
      phone: '+1-555-0456',
      payment_terms: 'Net 15'
    },
    service: {
      name: 'Professional Supplies Inc.',
      contact_person: 'Mike Wilson',
      email: 'info@prosupplies.com',
      phone: '+1-555-0789',
      payment_terms: 'Net 30'
    }
  };

  const template = supplierTemplates[businessType] || supplierTemplates.service;

  return {
    supplier_id: `${businessId}_supplier_1`,
    business_id: businessId,
    ...template,
    address: '123 Supplier Street, Business City, BC 12345',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    is_active: true
  };
}

/**
 * Get module enablements for business
 */
function getModuleEnablements(businessId: string, businessType: BusinessData['business_type']): ModuleEnablement[] {
  const modules = getDefaultModules(businessType);

  return modules.map((moduleId, index): ModuleEnablement => ({
    id: `${businessId}_module_${index + 1}`,
    business_id: businessId,
    module_id: moduleId,
    module_config: {},
    enabled_at: serverTimestamp(),
    disabled_at: null,
    is_active: true
  }));
}