/**
 * Service Factory
 * 
 * This file provides a convenient way to create typed service instances
 * for each collection in the Firestore database.
 * 
 * Use this factory to create service instances for your collections,
 * which will provide properly typed methods for CRUD operations.
 */

import { TypedFirestoreService } from './firestore-service-utils';
import { 
  BusinessDocument,
  CategoryDocument,
  ProductDocument,
  SupplierDocument,
  EmployeeDocument,
  CustomerDocument,
  TransactionDocument
} from '@/types/schema';

/**
 * Service factory for creating typed services for different collections
 */
export class ServiceFactory {
  /**
   * Create a service for the businesses collection
   */
  static business() {
    return new TypedFirestoreService<BusinessDocument>('businesses');
  }
  
  /**
   * Create a service for the employees subcollection of a business
   */
  static employees(businessId: string) {
    return new TypedFirestoreService<EmployeeDocument>(`businesses/${businessId}/employees`);
  }
  
  /**
   * Create a service for the products subcollection of a business
   */
  static products(businessId: string) {
    return new TypedFirestoreService<ProductDocument>(`businesses/${businessId}/products`);
  }
  
  /**
   * Create a service for the categories subcollection of a business
   */
  static categories(businessId: string) {
    return new TypedFirestoreService<CategoryDocument>(`businesses/${businessId}/categories`);
  }
  
  /**
   * Create a service for the suppliers subcollection of a business
   */
  static suppliers(businessId: string) {
    return new TypedFirestoreService<SupplierDocument>(`businesses/${businessId}/suppliers`);
  }
  
  /**
   * Create a service for the customers subcollection of a business
   */
  static customers(businessId: string) {
    return new TypedFirestoreService<CustomerDocument>(`businesses/${businessId}/customers`);
  }
  
  /**
   * Create a service for the transactions subcollection of a business
   */
  static transactions(businessId: string) {
    return new TypedFirestoreService<TransactionDocument>(`businesses/${businessId}/transactions`);
  }
}
