/**
 * Transaction Service
 * 
 * Service for managing transaction data in Firestore.
 * This service provides typed operations for the transaction collection.
 */

import {
  collection, 
  getDocs,
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, collections } from '../firebase';
import { TransactionDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { FirestoreService, FirestoreQueryOptions, PaginatedResult } from '../../components/TableLayout/firestoreService';

/**
 * Transaction Service for handling transaction-related Firestore operations
 */
export class TransactionService {
  /**
   * Get transactions for a specific business with pagination, filtering and sorting
   */
  static async getTransactions(
    businessId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<TransactionDocument>> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    
    // Set default sorting by transaction date descending if not specified
    options.orderBy = options.orderBy || { field: 'transaction_date', direction: 'desc' };
    
    return FirestoreService.getDocuments<TransactionDocument>(transactionsCollection, options);
  }

  /**
   * Get a transaction by ID
   */
  static async getTransactionById(
    businessId: string,
    transactionId: string
  ): Promise<TransactionDocument | null> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    return FirestoreService.getDocumentById<TransactionDocument>(transactionsCollection, transactionId);
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(
    businessId: string,
    data: CreateDocument<TransactionDocument>
  ): Promise<TransactionDocument> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    
    // Make sure business_id is set
    const completeData: CreateDocument<TransactionDocument> = {
      ...data,
      business_id: businessId
    };
    
    return FirestoreService.createDocument<TransactionDocument>(transactionsCollection, completeData);
  }

  /**
   * Update an existing transaction
   * Note: In real world scenarios, you might want to restrict which fields can be updated
   */
  static async updateTransaction(
    businessId: string,
    data: UpdateDocument<TransactionDocument>
  ): Promise<void> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    return FirestoreService.updateDocument<TransactionDocument>(transactionsCollection, data);
  }

  /**
   * Soft delete a transaction
   */
  static async deleteTransaction(
    businessId: string,
    transactionId: string
  ): Promise<void> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    return FirestoreService.softDeleteDocument(transactionsCollection, transactionId);
  }

  /**
   * Get transactions by date range
   */
  static async getTransactionsByDateRange(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionDocument[]> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const q = query(
      transactionsCollection,
      where('transaction_date', '>=', startTimestamp),
      where('transaction_date', '<=', endTimestamp),
      where('is_active', '==', true),
      orderBy('transaction_date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as TransactionDocument);
  }
  
  /**
   * Get transactions by employee
   */
  static async getTransactionsByEmployee(
    businessId: string,
    employeeId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<TransactionDocument>> {
    const transactionsCollection = collections.getTransactionsCollection(businessId);
    
    // Add employee filter to existing options
    const employeeOptions: FirestoreQueryOptions = {
      ...options,
      filters: {
        ...(options.filters || {}),
        employee_id: employeeId
      },
      orderBy: options.orderBy || { field: 'transaction_date', direction: 'desc' as const }
    };
    
    return FirestoreService.getDocuments<TransactionDocument>(transactionsCollection, employeeOptions);
  }

  /**
   * Get daily sales summary
   */
  static async getDailySalesSummary(
    businessId: string,
    date: Date
  ): Promise<{ total: number, count: number }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const transactions = await this.getTransactionsByDateRange(
      businessId,
      startOfDay,
      endOfDay
    );
    
    return transactions.reduce(
      (summary, transaction) => {
        return {
          total: summary.total + transaction.total_amount,
          count: summary.count + 1
        };
      },
      { total: 0, count: 0 }
    );
  }
}
