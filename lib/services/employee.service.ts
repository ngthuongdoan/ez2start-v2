/**
 * Employee Service
 * 
 * Service for managing employee data in Firestore.
 * This service provides typed operations for employees collection.
 */

import {
  collection, 
  doc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db, collections } from '../firebase';
import { EmployeeDocument } from '../../types/schema';
import { CreateDocument, UpdateDocument } from '../../types/core';
import { FirestoreService, FirestoreQueryOptions, PaginatedResult } from '../../components/TableLayout/firestoreService';

/**
 * Employee Service for handling employee-related Firestore operations
 */
export class EmployeeService {
  /**
   * Get employees for a specific business with pagination, filtering and sorting
   */
  static async getEmployees(
    businessId: string,
    options: FirestoreQueryOptions = {}
  ): Promise<PaginatedResult<EmployeeDocument>> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    return FirestoreService.getDocuments(employeesCollection, options);
  }

  /**
   * Get an employee by ID
   */
  static async getEmployeeById(
    businessId: string,
    employeeId: string
  ): Promise<EmployeeDocument | null> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    return FirestoreService.getDocumentById(employeesCollection, employeeId);
  }

  /**
   * Get an employee by user UID (Firebase Auth ID)
   */
  static async getEmployeeByUserId(
    businessId: string,
    userUid: string
  ): Promise<EmployeeDocument | null> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    
    const q = query(
      employeesCollection,
      where('user_uid', '==', userUid),
      where('is_active', '==', true),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].data();
  }

  /**
   * Create a new employee
   */
  static async createEmployee(
    businessId: string,
    data: CreateDocument<EmployeeDocument>
  ): Promise<EmployeeDocument> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    
    // Make sure business_id is set
    const completeData: CreateDocument<EmployeeDocument> = {
      ...data,
      business_id: businessId
    };
    
    return FirestoreService.createDocument(employeesCollection, completeData);
  }

  /**
   * Update an existing employee
   */
  static async updateEmployee(
    businessId: string,
    data: UpdateDocument<EmployeeDocument>
  ): Promise<void> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    return FirestoreService.updateDocument(employeesCollection, data);
  }

  /**
   * Soft delete an employee
   */
  static async deleteEmployee(
    businessId: string,
    employeeId: string
  ): Promise<void> {
    const employeesCollection = collections.getEmployeesCollection(businessId);
    return FirestoreService.softDeleteDocument(employeesCollection, employeeId);
  }
  
  /**
   * Legacy API for backward compatibility
   */
  static async getAllEmployees(): Promise<any[]> {
    return FirestoreService.getAllDocumentsLegacy('employees');
  }
}
