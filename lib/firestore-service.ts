/**
 * Firestore Service Example
 * 
 * This file demonstrates how to use the type system with Firestore.
 */

import { 
  collection, doc, getDoc, getDocs, query, where, 
  orderBy, limit, addDoc, updateDoc, deleteDoc, 
  writeBatch, serverTimestamp, onSnapshot,
  FirestoreDataConverter, DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  BaseDocument,
  CreateDocument,
  UpdateDocument,
} from '../types/core';
import {
  BusinessDocument,
  ProductDocument,
  UserDocument,
  CustomerDocument
} from '../types/schema';
import {
  convertToFirestore,
  convertForUpdate,
  convertFromFirestore,
  createFirestoreConverter
} from '../types/firestore-utils';

/**
 * Generic Firestore service with typed operations
 */
export class FirestoreService<T extends BaseDocument> {
  private collectionPath: string;
  private converter: FirestoreDataConverter<T, any>;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
    this.converter = createFirestoreConverter<T>() as FirestoreDataConverter<T, any>;
  }

  /**
   * Get a reference to the collection with type conversion
   */
  protected getCollection() {
    return collection(db, this.collectionPath).withConverter(this.converter as FirestoreDataConverter<T, any>);
  }

  /**
   * Get a reference to a document with type conversion
   */
  protected getDocRef(id: string) {
    return doc(this.getCollection(), id);
  }

  /**
   * Get a document by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        return snapshot.data() as T;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting document with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get multiple documents by their IDs
   */
  async getByIds(ids: string[]): Promise<T[]> {
    try {
      if (ids.length === 0) return [];
      
      const q = query(
        this.getCollection(),
        where('id', 'in', ids)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error(`Error getting documents by IDs [${ids.join(', ')}]:`, error);
      return [];
    }
  }

  /**
   * Create a new document
   */
  async create(data: CreateDocument<T>): Promise<T> {
    try {
      const firestoreData = convertToFirestore(data);
      const docRef = await addDoc(this.getCollection(), firestoreData);
      
      // Get the created document to return with proper typing
      const snapshot = await getDoc(docRef);
      return snapshot.data() as T;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Update an existing document
   */
  async update(data: UpdateDocument<T>): Promise<void> {
    try {
      const { id, ...updateData } = data;
      const firestoreData = convertForUpdate(data);
      await updateDoc(this.getDocRef(id), firestoreData);
    } catch (error) {
      console.error(`Error updating document with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id));
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete a document by setting is_active to false
   */
  async softDelete(id: string): Promise<void> {
    try {
      await updateDoc(this.getDocRef(id), {
        is_active: false,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error soft-deleting document with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all active documents
   */
  async getAll(): Promise<T[]> {
    try {
      const q = query(
        this.getCollection(),
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as T);
    } catch (error) {
      console.error('Error getting all documents:', error);
      return [];
    }
  }

  /**
   * Listen for real-time updates to a document
   */
  subscribeToDocument(id: string, callback: (data: T | null) => void) {
    try {
      return onSnapshot(this.getDocRef(id), (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as T);
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error(`Error subscribing to document with ID ${id}:`, error);
      callback(null);
      // Return an unsubscribe function that does nothing
      return () => {};
    }
  }

  /**
   * Listen for real-time updates to a query
   */
  subscribeToQuery(
    queryFn: (collection: ReturnType<typeof this.getCollection>) => any,
    callback: (data: T[]) => void
  ) {
    try {
      const q = queryFn(this.getCollection());
      
      return onSnapshot(q, (snapshot: any) => {
        const data = snapshot.docs.map((doc: any) => doc.data() as T);
        callback(data);
      });
    } catch (error) {
      console.error('Error subscribing to query:', error);
      callback([]);
      // Return an unsubscribe function that does nothing
      return () => {};
    }
  }
}

/**
 * Business-specific Firestore service
 */
export class BusinessService extends FirestoreService<BusinessDocument> {
  constructor() {
    super('businesses');
  }

  /**
   * Get businesses owned by a specific user
   */
  async getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]> {
    try {
      const q = query(
        this.getCollection(),
        where('owner_uid', '==', ownerId),
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as BusinessDocument);
    } catch (error) {
      console.error(`Error getting businesses for owner ${ownerId}:`, error);
      return [];
    }
  }

  /**
   * Get businesses a user has access to (as owner or employee)
   */
  async getBusinessesForUser(userId: string): Promise<BusinessDocument[]> {
    try {
      // Get user document which contains business IDs
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) return [];
      
      const userData = userDoc.data() as UserDocument;
      if (!userData.businesses || userData.businesses.length === 0) return [];
      
      // Get all businesses the user has access to
      return this.getByIds(userData.businesses);
    } catch (error) {
      console.error(`Error getting businesses for user ${userId}:`, error);
      return [];
    }
  }
}

/**
 * Product-specific Firestore service
 * 
 * Note how this handles subcollections within a business
 */
export class ProductService extends FirestoreService<ProductDocument> {
  private businessId: string;
  
  constructor(businessId: string) {
    super(`businesses/${businessId}/products`);
    this.businessId = businessId;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string): Promise<ProductDocument[]> {
    try {
      const q = query(
        this.getCollection(),
        where('category_id', '==', categoryId),
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ProductDocument);
    } catch (error) {
      console.error(`Error getting products for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<ProductDocument[]> {
    try {
      const q = query(
        this.getCollection(),
        where('is_active', '==', true),
        where('stock_quantity', '<=', 'min_stock_level')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ProductDocument);
    } catch (error) {
      console.error('Error getting low stock products:', error);
      return [];
    }
  }

  /**
   * Search products by name or SKU
   */
  async searchProducts(searchTerm: string): Promise<ProductDocument[]> {
    try {
      // Note: This requires a separate search index or service for production
      // This is a simplified example that would only work with small datasets
      const term = searchTerm.toLowerCase().trim();
      
      const q = query(
        this.getCollection(),
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      // Client-side filtering (not efficient for large datasets)
      return snapshot.docs
        .map(doc => doc.data() as ProductDocument)
        .filter(product => {
          return product.name.toLowerCase().includes(term) || 
                 product.sku.toLowerCase().includes(term) || 
                 (product.barcode && product.barcode.toLowerCase().includes(term));
        });
    } catch (error) {
      console.error(`Error searching products with term "${searchTerm}":`, error);
      return [];
    }
  }
}

/**
 * Example of using these services
 */
async function exampleUsage() {
  // Initialize services
  const businessService = new BusinessService();
  
  // Get businesses for the current user
  const businesses = await businessService.getBusinessesByOwner('current-user-id');
  
  if (businesses.length > 0) {
    const businessId = businesses[0].id;
    
    // Initialize business-specific services
    const productService = new ProductService(businessId);
    
    // Get low stock products
    const lowStockProducts = await productService.getLowStockProducts();
    
    // Update a product
    await productService.update({
      id: 'product-id',
      stock_quantity: 20,
      price: 19.99
    });
  }
}
