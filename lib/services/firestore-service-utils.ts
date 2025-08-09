/**
 * Firestore Service Utils
 * 
 * This file contains helper functions to properly configure the FirestoreService
 * to work with our typed schema, resolving the type errors encountered in our services.
 */

import { 
  collection, 
  doc, 
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseDocument } from '@/types/core';
import { FirestoreService } from '@/components/TableLayout/firestoreService';

/**
 * Create a properly typed collection reference
 * 
 * @param path The path to the collection
 * @returns A collection reference with the correct type
 */
export function createTypedCollection<T extends BaseDocument>(path: string) {
  // Create a converter that ensures documents are properly typed
  const converter: FirestoreDataConverter<T> = {
    toFirestore(data) {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id
      } as T;
    }
  };
  
  return collection(db, path).withConverter(converter);
}

/**
 * Create a properly typed subcollection reference
 * 
 * @param parentPath The path to the parent document
 * @param collectionName The name of the subcollection
 * @returns A collection reference with the correct type
 */
export function createTypedSubcollection<T extends BaseDocument>(
  parentPath: string, 
  collectionName: string
) {
  // Create a converter that ensures documents are properly typed
  const converter: FirestoreDataConverter<T> = {
    toFirestore(data) {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id
      } as T;
    }
  };
  
  return collection(db, parentPath, collectionName).withConverter(converter);
}

/**
 * Extended FirestoreService with better typing
 * 
 * This class extends the base FirestoreService to work correctly with our schema types
 */
export class TypedFirestoreService<T extends BaseDocument> {
  private collectionRef;
  
  constructor(collectionPath: string) {
    this.collectionRef = createTypedCollection<T>(collectionPath);
  }
  
  /**
   * Get a subcollection service
   */
  getSubcollectionService<U extends BaseDocument>(documentId: string, subcollectionName: string) {
    return new TypedFirestoreService<U>(`${this.collectionRef.path}/${documentId}/${subcollectionName}`);
  }
  
  /**
   * Get documents with improved type safety
   */
  async getDocuments(options = {}) {
    return FirestoreService.getDocuments<T>(this.collectionRef, options);
  }
  
  /**
   * Get a document by ID
   */
  async getDocumentById(id: string) {
    return FirestoreService.getDocumentById<T>(this.collectionRef, id);
  }
  
  /**
   * Create a document
   */
  async createDocument(data: Partial<T>) {
    // Cast as CreateDocument<T> since we're ensuring all required fields are present
    return FirestoreService.createDocument<T>(this.collectionRef, data as any);
  }
  
  /**
   * Update a document
   */
  async updateDocument(data: Partial<T> & { id: string }) {
    return FirestoreService.updateDocument<T>(this.collectionRef, data);
  }
  
  /**
   * Soft delete a document
   */
  async softDeleteDocument(id: string) {
    return FirestoreService.softDeleteDocument<T>(this.collectionRef, id);
  }
}
