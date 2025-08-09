/**
 * Enhanced FirestoreService for Type Compatibility
 * 
 * This is a wrapper around the existing FirestoreService that
 * handles type casting to work with our schema types.
 */

import { 
  collection, 
  CollectionReference, 
  DocumentData,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreService, FirestoreQueryOptions } from '@/components/TableLayout/firestoreService';
import { BaseDocument } from '@/types/core';

/**
 * A compatibility layer service that wraps FirestoreService with proper type handling
 */
export class CompatFirestoreService {
  /**
   * Get documents with proper type handling
   */
  static async getDocuments<T>(
    collectionPath: string,
    businessId: string,
    options: FirestoreQueryOptions = {}
  ) {
    const collectionRef = collection(db, `${collectionPath}/${businessId}`) as any;
    return FirestoreService.getDocuments<T>(collectionRef, options);
  }
  
  /**
   * Get a document by ID with proper type handling
   */
  static async getDocumentById<T>(
    collectionPath: string,
    businessId: string,
    documentId: string
  ) {
    const collectionRef = collection(db, `${collectionPath}/${businessId}`) as any;
    return FirestoreService.getDocumentById<T>(collectionRef, documentId);
  }
  
  /**
   * Create a document with proper type handling
   */
  static async createDocument<T extends BaseDocument>(
    collectionPath: string,
    businessId: string,
    data: Partial<T>
  ) {
    const collectionRef = collection(db, `${collectionPath}/${businessId}`) as any;
    
    // Ensure business_id is set
    const dataWithBusinessId = {
      ...data,
      business_id: businessId
    };
    
    return FirestoreService.createDocument<T>(collectionRef, dataWithBusinessId as any);
  }
  
  /**
   * Update a document with proper type handling
   */
  static async updateDocument<T extends BaseDocument>(
    collectionPath: string,
    businessId: string,
    data: Partial<T> & { id: string }
  ) {
    const collectionRef = collection(db, `${collectionPath}/${businessId}`) as any;
    return FirestoreService.updateDocument<T>(collectionRef, data as any);
  }
  
  /**
   * Soft delete a document
   */
  static async softDeleteDocument(
    collectionPath: string,
    businessId: string,
    documentId: string
  ) {
    const collectionRef = collection(db, `${collectionPath}/${businessId}`) as any;
    return FirestoreService.softDeleteDocument(collectionRef, documentId);
  }
}
