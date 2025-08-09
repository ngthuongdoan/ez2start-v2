/**
 * Module Service
 * 
 * Service for managing modules in Firestore.
 * This service provides typed operations for modules collection.
 */

import {
  query, 
  where, 
  getDocs,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db, collections } from '../firebase';
import { ModuleDocument, BusinessDocument } from '../../types/schema';
import { TypedFirestoreService } from './firestore-service-utils';
import { ServiceFactory } from './service-factory';

/**
 * Module Service for handling module-related Firestore operations
 */
export class ModuleService {
  private static modulesService = new TypedFirestoreService<ModuleDocument>('modules');
  
  /**
   * Get all available modules
   */
  static async getAllModules(): Promise<ModuleDocument[]> {
    return this.modulesService.getDocuments().then(result => result.data);
  }

  /**
   * Get modules by category
   */
  static async getModulesByCategory(category: string): Promise<ModuleDocument[]> {
    const options = {
      filters: {
        category,
        is_active: true
      }
    };
    
    return this.modulesService.getDocuments(options).then(result => result.data);
  }

  /**
   * Get modules by tier
   */
  static async getModulesByTier(tier: string): Promise<ModuleDocument[]> {
    const options = {
      filters: {
        pricing_tier: tier,
        is_active: true
      }
    };
    
    return this.modulesService.getDocuments(options).then(result => result.data);
  }

  /**
   * Get modules for a business
   */
  static async getEnabledModules(businessId: string): Promise<ModuleDocument[]> {
    // First get the business to get the list of enabled modules
    const businessService = ServiceFactory.business();
    const business = await businessService.getDocumentById(businessId);
    
    if (!business || !business.enabled_modules || business.enabled_modules.length === 0) {
      return [];
    }
    
    // Then get the module documents
    const moduleIds = business.enabled_modules;
    const modules: ModuleDocument[] = [];
    
    // We could do a batch get here, but we'll keep it simple
    for (const moduleId of moduleIds) {
      const module = await this.modulesService.getDocumentById(moduleId);
      if (module && module.is_active) {
        modules.push(module);
      }
    }
    
    return modules;
  }

  /**
   * Enable modules for a business
   */
  static async enableModules(
    businessId: string, 
    moduleIds: string[]
  ): Promise<void> {
    // First get the business
    const businessService = ServiceFactory.business();
    const business = await businessService.getDocumentById(businessId);
    
    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }
    
    // Update the business with the new modules
    const enabledModules = Array.from(new Set([
      ...(business.enabled_modules || []), 
      ...moduleIds
    ]));
    
    await businessService.updateDocument({
      id: businessId,
      enabled_modules: enabledModules
    });
  }

  /**
   * Disable modules for a business
   */
  static async disableModules(
    businessId: string, 
    moduleIds: string[]
  ): Promise<void> {
    // First get the business
    const businessService = ServiceFactory.business();
    const business = await businessService.getDocumentById(businessId);
    
    if (!business) {
      throw new Error(`Business with ID ${businessId} not found`);
    }
    
    // Remove the specified modules
    const enabledModules = (business.enabled_modules || []).filter(
      id => !moduleIds.includes(id)
    );
    
    await businessService.updateDocument({
      id: businessId,
      enabled_modules: enabledModules
    });
  }
}
