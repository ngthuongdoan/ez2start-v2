import { collection, getDocs, query, orderBy, where, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FirestoreQueryOptions {
  searchQuery?: string;
  searchFields?: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
  filters?: Record<string, any>;
}

export class FirestoreService {
  static async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    const q = collection(db, collectionName);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
  static async getDocuments<T>(
    collectionName: string,
    options: FirestoreQueryOptions = {}
  ): Promise<{ data: T[]; lastDoc?: DocumentSnapshot; hasMore: boolean }> {
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

    // Apply search (Note: Firestore has limited text search capabilities)
    // For better search, consider using Algolia or similar service
    if (searchQuery && searchFields.length > 0) {
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
    queryConstraints.push(limit(pageSize + 1)); // +1 to check if there are more pages

    const finalQuery = query(q, ...queryConstraints);
    const snapshot = await getDocs(finalQuery);

    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;

    // Remove the extra document if we have more pages
    if (hasMore) {
      docs.pop();
    }

    const data = docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    return {
      data,
      lastDoc: docs[docs.length - 1],
      hasMore
    };
  }
}
