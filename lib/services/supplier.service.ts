/**
 * Supplier Service
 * 
 * Service for managing supplier data in Firestore.
 * This service provides typed operations for suppliers collection.
 */

import { collections } from '../firebase';
import { SupplierDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { FirestoreService, FirestoreQueryOptions, PaginatedResult } from '../../components/TableLayout/firestoreService';

/**
 * Supplier Service for handling supplier-related Firestore operations
 */
export class SupplierService {
  /**
   * Get suppliers for a specific business with pagination, filtering and sorting
   */
  static async getSuppliers(
    businessId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<SupplierDocument>> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    return FirestoreService.getDocuments<SupplierDocument>(suppliersCollection, options);
  }

  /**
   * Get a supplier by ID
   */
  static async getSupplierById(
    businessId: string,
    supplierId: string
  ): Promise<SupplierDocument | null> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    return FirestoreService.getDocumentById<SupplierDocument>(suppliersCollection, supplierId);
  }

  /**
   * Create a new supplier
   */
  static async createSupplier(
    businessId: string,
    data: CreateDocument<SupplierDocument>
  ): Promise<SupplierDocument> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    
    // Make sure business_id is set
    const completeData: CreateDocument<SupplierDocument> = {
      ...data,
      business_id: businessId
    };
    
    return FirestoreService.createDocument<SupplierDocument>(suppliersCollection, completeData);
  }

  /**
   * Update an existing supplier
   */
  static async updateSupplier(
    businessId: string,
    data: UpdateDocument<SupplierDocument>
  ): Promise<void> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    return FirestoreService.updateDocument<SupplierDocument>(suppliersCollection, data);
  }

  /**
   * Soft delete a supplier
   */
  static async deleteSupplier(
    businessId: string,
    supplierId: string
  ): Promise<void> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    return FirestoreService.softDeleteDocument(suppliersCollection, supplierId);
  }
  
  /**
   * Search suppliers by name or contact
   */
  static async searchSuppliers(
    businessId: string, 
    searchTerm: string
  ): Promise<SupplierDocument[]> {
    const suppliersCollection = collections.getSuppliersCollection(businessId);
    
    // Using a simple query for active suppliers
    const options: FirestoreQueryOptions = {
      filters: {
        is_active: true
      }
    };
    
    const result = await FirestoreService.getDocuments<SupplierDocument>(
      suppliersCollection, 
      options
    );
    
    // Client-side filtering (would need a search service for production)
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Simple text search, adjust field names based on your SupplierDocument structure
    return result.data.filter(supplier => {
      if (!supplier.name) return false;
      
      // Basic name search
      return supplier.name.toLowerCase().includes(searchTermLower);
      
      // For more advanced searching when you implement contact person fields:
      // return (
      //   supplier.name.toLowerCase().includes(searchTermLower) || 
      //   (supplier.contact_person && supplier.contact_person.includes(searchTermLower))
      // );
    });
  }
}
