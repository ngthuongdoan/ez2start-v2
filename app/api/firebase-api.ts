/**
 * Firebase API Wrapper
 * 
 * This module provides a simplified API for interacting with Firebase services
 * from API routes, handling type conversion and error handling.
 */
import { ServiceFactory } from '@/lib/services/service-factory';

export const FirebaseAPI = {
  /**
   * Get employees for a business
   */
  getEmployees: async (businessId: string, options = {}) => {
    try {
      const service = ServiceFactory.employees(businessId);
      return await service.getDocuments(options);
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  },
  
  /**
   * Get a single employee by ID
   */
  getEmployee: async (businessId: string, employeeId: string) => {
    try {
      const service = ServiceFactory.employees(businessId);
      return await service.getDocumentById(employeeId);
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  },
  
  /**
   * Create a new employee
   */
  createEmployee: async (businessId: string, data: any) => {
    try {
      const service = ServiceFactory.employees(businessId);
      return await service.createDocument({
        ...data,
        business_id: businessId
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  },
  
  /**
   * Get products for a business
   */
  getProducts: async (businessId: string, options = {}) => {
    try {
      const service = ServiceFactory.products(businessId);
      return await service.getDocuments(options);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },
  
  /**
   * Get a single product by ID
   */
  getProduct: async (businessId: string, productId: string) => {
    try {
      const service = ServiceFactory.products(businessId);
      return await service.getDocumentById(productId);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },
  
  /**
   * Create a new product
   */
  createProduct: async (businessId: string, data: any) => {
    try {
      const service = ServiceFactory.products(businessId);
      return await service.createDocument({
        ...data,
        business_id: businessId
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },
  
  /**
   * Get categories for a business
   */
  getCategories: async (businessId: string, options = {}) => {
    try {
      const service = ServiceFactory.categories(businessId);
      return await service.getDocuments(options);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },
  
  /**
   * Create a new category
   */
  createCategory: async (businessId: string, data: any) => {
    try {
      const service = ServiceFactory.categories(businessId);
      return await service.createDocument({
        ...data,
        business_id: businessId
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }
};
