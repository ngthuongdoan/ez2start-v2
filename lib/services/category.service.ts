/**
 * Category Service
 * 
 * Service for managing product categories in Firestore.
 * This service provides typed operations for categories collection.
 */

import {
  collection, 
  getDocs,
  query, 
  where,
  FirestoreDataConverter
} from 'firebase/firestore';
import { db, collections, categoryConverter } from '../firebase';
import { CategoryDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { FirestoreService, FirestoreQueryOptions, PaginatedResult } from '../../components/TableLayout/firestoreService';

/**
 * Category Service for handling category-related Firestore operations
 */
export class CategoryService {
  /**
   * Get categories for a specific business with pagination, filtering and sorting
   */
  static async getCategories(
    businessId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<CategoryDocument>> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      return FirestoreService.getDocuments<CategoryDocument>(categoriesCollection, options);
    } catch (error) {
      console.error(`Error getting categories for business ${businessId}:`, error);
      return {
        data: [],
        lastDoc: undefined,
        hasMore: false,
        totalCount: 0
      };
    }
  }

  /**
   * Get a category by ID
   */
  static async getCategoryById(
    businessId: string,
    categoryId: string
  ): Promise<CategoryDocument | null> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      return FirestoreService.getDocumentById<CategoryDocument>(categoriesCollection, categoryId);
    } catch (error) {
      console.error(`Error getting category ${categoryId} for business ${businessId}:`, error);
      return null;
    }
  }

  /**
   * Create a new category
   */
  static async createCategory(
    businessId: string,
    data: CreateDocument<CategoryDocument>
  ): Promise<CategoryDocument> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      
      // Make sure business_id is set
      const completeData: CreateDocument<CategoryDocument> = {
        ...data,
        business_id: businessId
      };
      
      return FirestoreService.createDocument<CategoryDocument>(categoriesCollection, completeData);
    } catch (error) {
      console.error(`Error creating category for business ${businessId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(
    businessId: string,
    data: UpdateDocument<CategoryDocument>
  ): Promise<void> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      return FirestoreService.updateDocument<CategoryDocument>(categoriesCollection, data);
    } catch (error) {
      console.error(`Error updating category ${data.id} for business ${businessId}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete a category
   */
  static async deleteCategory(
    businessId: string,
    categoryId: string
  ): Promise<void> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      return FirestoreService.softDeleteDocument<CategoryDocument>(categoriesCollection, categoryId);
    } catch (error) {
      console.error(`Error deleting category ${categoryId} for business ${businessId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get active categories
   */
  static async getActiveCategories(
    businessId: string
  ): Promise<CategoryDocument[]> {
    try {
      const categoriesCollection = collections.getCategoriesCollection(businessId)
        .withConverter(categoryConverter as FirestoreDataConverter<CategoryDocument, any>);
      
      const q = query(
        categoriesCollection,
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as CategoryDocument);
    } catch (error) {
      console.error(`Error getting active categories for business ${businessId}:`, error);
      return [];
    }
  }
}
