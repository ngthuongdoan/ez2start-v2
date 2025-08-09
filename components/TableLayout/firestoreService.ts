import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  where, 
  limit, 
  startAfter, 
  DocumentSnapshot,
  CollectionReference,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  DocumentReference,
  QueryConstraint,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseDocument, CreateDocument, UpdateDocument } from '@/types/core';
import { convertToFirestore, convertForUpdate } from '@/types/firestore-utils';

/**
 * Options for querying Firestore collections
 */
export interface FirestoreQueryOptions<T = any> {
  searchQuery?: string;
  searchFields?: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  lastDoc?: DocumentSnapshot<T>;
  filters?: Record<string, any>;
  showInactive?: boolean; // Whether to include inactive documents
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

  /**
   * Result type for paginated queries
   */
  export interface PaginatedResult<T> {
    data: T[];
    lastDoc?: DocumentSnapshot<T>;
    hasMore: boolean;
    totalCount?: number;
  }/**
 * Enhanced FirestoreService with type safety and new utility methods
 */
export class FirestoreService {
  /**
   * Get all documents from a collection
   */
  static async getAllDocuments<T>(collectionRef: CollectionReference<T>): Promise<T[]> {
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => doc.data());
  }

  /**
   * Get documents with pagination, filtering, and sorting
   */
  static async getDocuments<T>(
    collectionRef: CollectionReference<T>,
    options: FirestoreQueryOptions<T> = {}
  ): Promise<PaginatedResult<T>> {
    const {
      searchQuery,
      searchFields = [],
      sortField = 'updated_at',
      sortDirection = 'desc',
      pageSize = 25,
      lastDoc,
      filters = {},
      showInactive = false,
      orderBy: orderByOption
    } = options;

    let queryConstraints: QueryConstraint[] = [];

    // Apply active filter unless specifically showing inactive
    if (!showInactive) {
      queryConstraints.push(where('is_active', '==', true));
    }

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryConstraints.push(where(field, '==', value));
      }
    });

    // Apply search (Note: Firestore has limited text search capabilities)
    if (searchQuery && searchFields.length > 0) {
      // For better search, consider using search_terms array field with Firebase extensions
      // or implement Algolia/Elasticsearch

      // Simple starts-with search on the first search field
      const field = searchFields[0];
      queryConstraints.push(
        where(field, '>=', searchQuery),
        where(field, '<=', searchQuery + '\uf8ff')
      );
    }

    // Apply sorting
    queryConstraints.push(orderBy(sortField, sortDirection));

    // Apply pagination
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }

    // Get one extra document to determine if there are more pages
    queryConstraints.push(limit(pageSize + 1));

    // Execute query
    const finalQuery = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(finalQuery);

    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;

    // Remove the extra document if we have more pages
    if (hasMore) {
      docs.pop();
    }

    return {
      data: docs.map(doc => doc.data()),
      lastDoc: docs.length > 0 ? docs[docs.length - 1] as unknown as DocumentSnapshot<T> : undefined,
      hasMore
    };
  }

  /**
   * Get a document by ID
   */
  static async getDocumentById<T>(collectionRef: CollectionReference<T>, id: string): Promise<T | null> {
    const docRef = doc(collectionRef, id) as DocumentReference<T>;
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return null;
  }

  /**
   * Create a new document
   */
  static async createDocument<T extends BaseDocument>(
    collectionRef: CollectionReference<T>, 
    data: CreateDocument<T>
  ): Promise<T> {
    // Add default fields
    const docWithDefaults = {
      ...data,
      is_active: data.is_active ?? true,
    };
    
    // Convert to Firestore format
    const firestoreData = convertToFirestore(docWithDefaults as any);
    
    // Add document
    const docRef = await addDoc(collectionRef, firestoreData);
    
    // Get the document to return with proper typing
    const newDoc = await getDoc(docRef as DocumentReference<T>);
    return newDoc.data() as T;
  }

  /**
   * Update an existing document
   */
  static async updateDocument<T extends BaseDocument>(
    collectionRef: CollectionReference<T>,
    data: UpdateDocument<T>
  ): Promise<void> {
    const { id } = data;
    if (!id) throw new Error('Document ID is required for updates');
    
    const docRef = doc(collectionRef, id) as DocumentReference<T>;
    const updateData = convertForUpdate(data);
    
    await updateDoc(docRef, updateData);
  }

  /**
   * Delete a document (hard delete)
   */
  static async deleteDocument<T>(
    collectionRef: CollectionReference<T>, 
    id: string
  ): Promise<void> {
    const docRef = doc(collectionRef, id);
    await deleteDoc(docRef);
  }

  /**
   * Soft delete a document by setting is_active to false
   */
  static async softDeleteDocument<T>(
    collectionRef: CollectionReference<T>, 
    id: string
  ): Promise<void> {
    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, {
      is_active: false,
      updated_at: serverTimestamp()
    });
  }

  /**
   * Batch operations (create, update, delete multiple documents in a transaction)
   */
  static async batchOperations<T extends BaseDocument>(
    operations: Array<{
      type: 'create' | 'update' | 'delete' | 'softDelete';
      collectionRef: CollectionReference<T>;
      id?: string;
      data?: Partial<T> | CreateDocument<T>;
    }>
  ): Promise<void> {
    const batch = writeBatch(db);

    for (const op of operations) {
      if (op.type === 'create' && op.data) {
        // For create operations, need to use a new document reference
        const newDocRef = doc(op.collectionRef);
        const createData = convertToFirestore(op.data as CreateDocument<T>);
        batch.set(newDocRef, createData);
      } 
      else if (op.type === 'update' && op.id && op.data) {
        // For update operations
        const docRef = doc(op.collectionRef, op.id);
        const updateData = {
          ...op.data,
          updated_at: serverTimestamp()
        };
        batch.update(docRef, updateData);
      } 
      else if (op.type === 'delete' && op.id) {
        // For delete operations
        const docRef = doc(op.collectionRef, op.id);
        batch.delete(docRef);
      } 
      else if (op.type === 'softDelete' && op.id) {
        // For soft delete operations
        const docRef = doc(op.collectionRef, op.id);
        batch.update(docRef, {
          is_active: false,
          updated_at: serverTimestamp()
        });
      }
    }

    await batch.commit();
  }

  // Legacy support for old API (backward compatibility)
  static async getAllDocumentsLegacy<T>(collectionName: string): Promise<T[]> {
    const q = collection(db, collectionName);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
  
  static async getDocumentsLegacy<T>(
    collectionName: string,
    options: FirestoreQueryOptions<T> = {}
  ): Promise<PaginatedResult<T>> {
    const {
      searchQuery,
      searchFields = [],
      sortField = 'createdAt',
      sortDirection = 'desc',
      pageSize = 25,
      lastDoc,
      filters = {}
    } = options;

    let q = collection(db, collectionName);
    let queryConstraints: any[] = [];

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryConstraints.push(where(field, '==', value));
      }
    });

    // Apply search
    if (searchQuery && searchFields.length > 0) {
      const field = searchFields[0];
      queryConstraints.push(
        where(field, '>=', searchQuery),
        where(field, '<=', searchQuery + '\uf8ff')
      );
    }

    // Apply sorting
    queryConstraints.push(orderBy(sortField, sortDirection));

    // Apply pagination
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }
    queryConstraints.push(limit(pageSize + 1));

    const finalQuery = query(q, ...queryConstraints);
    const snapshot = await getDocs(finalQuery);

    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;

    if (hasMore) {
      docs.pop();
    }

    const data = docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    return {
      data,
      lastDoc: docs.length > 0 ? docs[docs.length - 1] as unknown as DocumentSnapshot<T> : undefined,
      hasMore
    };
  }
}
