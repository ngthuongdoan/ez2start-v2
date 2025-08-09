/**
 * Business Service
 * 
 * Service for managing business data in Firestore.
 * This service provides typed operations for businesses collection.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp, 
  Timestamp,
  DocumentReference,
  CollectionReference,
  FirestoreDataConverter
} from 'firebase/firestore';
import { db, collections, businessConverter } from '../firebase';
import { BusinessDocument, UserDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { convertToFirestore, convertForUpdate } from '../../types/firestore-utils';
import { FirestoreService } from '../../components/TableLayout/firestoreService';

/**
 * Business Service for handling business-related Firestore operations
 */
export class BusinessService {
  /**
   * Get a business by ID
   */
  static async getBusinessById(businessId: string): Promise<BusinessDocument | null> {
    try {
      const docRef = doc(collections.businesses, businessId).withConverter(businessConverter);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as BusinessDocument) : null;
    } catch (error) {
      console.error(`Error getting business with ID ${businessId}:`, error);
      return null;
    }
  }
  
  /**
   * Get businesses owned by a specific user
   */
  static async getBusinessesByOwner(ownerId: string): Promise<BusinessDocument[]> {
    try {
      const q = query(
        collections.businesses.withConverter(businessConverter),
        where('owner_uid', '==', ownerId),
        where('is_active', '==', true),
        orderBy('updated_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as BusinessDocument);
    } catch (error) {
      console.error(`Error getting businesses for owner ${ownerId}:`, error);
      return [];
    }
  }

  /**
   * Get businesses that a user has access to (either as owner or employee)
   */
  static async getBusinessesForUser(userId: string): Promise<BusinessDocument[]> {
    try {
      // First get the user document which contains references to businesses
      const userDocRef = doc(collections.users, userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        return [];
      }
      
      const userData = userDoc.data() as UserDocument;
      if (!userData.businesses || userData.businesses.length === 0) {
        return [];
      }
      
      // Get all businesses the user has access to in a single batch
      const businessRefs = userData.businesses.map(
        businessId => doc(collections.businesses, businessId).withConverter(businessConverter)
      );
      
      // Filter out inactive businesses
      const businessDocs: BusinessDocument[] = [];
      
      // Use Promise.all for parallel fetching instead of sequential
      const businessSnapshots = await Promise.all(businessRefs.map(ref => getDoc(ref)));
      
      for (const snapshot of businessSnapshots) {
        if (snapshot.exists()) {
          const business = snapshot.data() as BusinessDocument;
          if (business.is_active) {
            businessDocs.push(business);
          }
        }
      }
      
      return businessDocs;
    } catch (error) {
      console.error('Error fetching businesses for user:', error);
      return [];
    }
  }

  /**
   * Create a new business
   */
  static async createBusiness(data: CreateDocument<BusinessDocument>): Promise<BusinessDocument> {
    try {
      // Use explicit typing to ensure proper type conversion
      const businessCollection = collections.businesses.withConverter(businessConverter as FirestoreDataConverter<BusinessDocument, any>);
      return FirestoreService.createDocument<BusinessDocument>(businessCollection, data);
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  /**
   * Update an existing business
   */
  static async updateBusiness(data: UpdateDocument<BusinessDocument>): Promise<void> {
    try {
      // Use explicit typing to ensure proper type conversion
      const businessCollection = collections.businesses.withConverter(businessConverter as FirestoreDataConverter<BusinessDocument, any>);
      return FirestoreService.updateDocument<BusinessDocument>(businessCollection, data);
    } catch (error) {
      console.error(`Error updating business with ID ${data.id}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete a business
   */
  static async deleteBusiness(businessId: string): Promise<void> {
    try {
      // Use explicit typing to ensure proper type conversion
      const businessCollection = collections.businesses.withConverter(businessConverter as FirestoreDataConverter<BusinessDocument, any>);
      return FirestoreService.softDeleteDocument(businessCollection, businessId);
    } catch (error) {
      console.error(`Error deleting business with ID ${businessId}:`, error);
      throw error;
    }
  }
}
