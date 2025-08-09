/**
 * Firestore Utilities
 * 
 * This file contains utilities for working with Firestore and type conversions.
 */

import { Timestamp as FirebaseTimestamp, FieldValue, serverTimestamp, WithFieldValue, PartialWithFieldValue, SetOptions } from 'firebase/firestore';
import { BaseDocument, Timestamp, CreateDocument, UpdateDocument } from './core';

/**
 * Convert a Firebase Timestamp to our internal Timestamp type
 */
export function convertFirestoreTimestamp(timestamp: FirebaseTimestamp | null | undefined): Timestamp | undefined {
  if (!timestamp) return undefined;
  return {
    seconds: timestamp.seconds,
    nanoseconds: timestamp.nanoseconds
  };
}

/**
 * Create timestamp fields for a new document
 */
export function withTimestamps<T extends object>(data: T): T & {
  created_at: FieldValue;
  updated_at: FieldValue;
} {
  return {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
}

/**
 * Add updated_at timestamp for document updates
 */
export function withUpdateTimestamp<T extends object>(data: T): T & {
  updated_at: FieldValue;
} {
  return {
    ...data,
    updated_at: serverTimestamp()
  };
}

/**
 * Convert Firestore document data to our domain model
 * This adds the document ID and properly converts timestamps
 */
export function convertFromFirestore<T extends BaseDocument>(
  id: string,
  data: Record<string, any>
): T {
  const result = {
    id,
    ...data,
    created_at: convertFirestoreTimestamp(data.created_at) || { seconds: 0, nanoseconds: 0 },
    updated_at: convertFirestoreTimestamp(data.updated_at) || { seconds: 0, nanoseconds: 0 }
  } as T;

  return result;
}

/**
 * Convert our domain model to Firestore document data for creation
 * This removes the id field and adds timestamps
 */
export function convertToFirestore<T extends BaseDocument>(
  data: CreateDocument<T>
): Record<string, any> {
  const firestoreData = {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  return firestoreData;
}

/**
 * Convert our domain model to Firestore document data for update
 * This removes the id field and adds updated_at timestamp
 */
export function convertForUpdate<T extends BaseDocument>(
  data: UpdateDocument<T>
): Record<string, any> {
  // Extract id and omit it from the data to be sent to Firestore
  const { id, ...updateData } = data;
  
  const firestoreData = {
    ...updateData,
    updated_at: serverTimestamp()
  };

  return firestoreData;
}

/**
 * Create a Firestore data converter for a specific document type
 * This helps with strongly typed reads and writes in Firestore
 */
export function createFirestoreConverter<T>() {
  return {
    toFirestore(data: WithFieldValue<T> | PartialWithFieldValue<T>, options?: SetOptions) {
      // Convert data to Firestore format
      return data;
    },
    fromFirestore(snapshot: any): T {
      // Convert Firestore data to typed object
      return snapshot.data() as T;
    }
  };
}