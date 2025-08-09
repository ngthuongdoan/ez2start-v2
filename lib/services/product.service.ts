/**
 * Product Service
 * 
 * Service for managing product data in Firestore.
 * This service provides typed operations for products collection.
 */

import {
  collection, 
  doc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db, collections } from '../firebase';
import { ProductDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { FirestoreService, FirestoreQueryOptions, PaginatedResult } from '../../components/TableLayout/firestoreService';

/**
 * Product Service for handling product-related Firestore operations
 */
export class ProductService {
  /**
   * Get products for a specific business with pagination, filtering and sorting
   */
  static async getProducts(
    businessId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<ProductDocument>> {
    const productsCollection = collections.getProductsCollection(businessId);
    return FirestoreService.getDocuments(productsCollection, options);
  }

  /**
   * Get a product by ID
   */
  static async getProductById(
    businessId: string,
    productId: string
  ): Promise<ProductDocument | null> {
    const productsCollection = collections.getProductsCollection(businessId);
    return FirestoreService.getDocumentById(productsCollection, productId);
  }

  /**
   * Get products by category ID
   */
  static async getProductsByCategory(
    businessId: string,
    categoryId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<ProductDocument>> {
    const productsCollection = collections.getProductsCollection(businessId);
    
    // Add category filter to existing options
    const categoryOptions: FirestoreQueryOptions = {
      ...options,
      filters: {
        ...(options.filters || {}),
        category_id: categoryId
      }
    };
    
    return FirestoreService.getDocuments(productsCollection, categoryOptions);
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(
    businessId: string
  ): Promise<ProductDocument[]> {
    const productsCollection = collections.getProductsCollection(businessId);
    
    // Using a manual query since we need to compare two fields
    const q = query(
      productsCollection,
      where('is_active', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    // Filter in-memory since Firestore can't compare fields directly
    return snapshot.docs
      .map(doc => doc.data())
      .filter(product => 
        typeof product.stock_quantity === 'number' && 
        typeof product.min_stock_level === 'number' && 
        product.stock_quantity <= product.min_stock_level
      );
  }

  /**
   * Create a new product
   */
  static async createProduct(
    businessId: string,
    data: CreateDocument<ProductDocument>
  ): Promise<ProductDocument> {
    const productsCollection = collections.getProductsCollection(businessId);
    
    // Make sure business_id is set
    const completeData: CreateDocument<ProductDocument> = {
      ...data,
      business_id: businessId
    };
    
    return FirestoreService.createDocument(productsCollection, completeData);
  }

  /**
   * Update an existing product
   */
  static async updateProduct(
    businessId: string,
    data: UpdateDocument<ProductDocument>
  ): Promise<void> {
    const productsCollection = collections.getProductsCollection(businessId);
    return FirestoreService.updateDocument(productsCollection, data);
  }

  /**
   * Soft delete a product
   */
  static async deleteProduct(
    businessId: string,
    productId: string
  ): Promise<void> {
    const productsCollection = collections.getProductsCollection(businessId);
    return FirestoreService.softDeleteDocument(productsCollection, productId);
  }
  
  /**
   * Search products by name or SKU
   * Note: For better text search, consider using Algolia or Firebase Extensions
   */
  static async searchProducts(
    businessId: string,
    searchTerm: string
  ): Promise<ProductDocument[]> {
    const productsCollection = collections.getProductsCollection(businessId);
    
    // Get all active products - not efficient for large datasets
    const q = query(
      productsCollection,
      where('is_active', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    // Client-side filtering (would need a search service for production)
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    return snapshot.docs
      .map(doc => doc.data())
      .filter(product => {
        return (
          (product.name && product.name.toLowerCase().includes(searchTermLower)) || 
          (product.sku && product.sku.toLowerCase().includes(searchTermLower)) || 
          (product.barcode && product.barcode.toLowerCase().includes(searchTermLower))
        );
      });
  }
}
