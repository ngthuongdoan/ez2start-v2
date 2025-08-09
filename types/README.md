# ez2start Type System

This directory contains TypeScript type definitions for the ez2start application. The types are organized by domain and follow a structured approach to align with the Firebase Firestore database design.

## Type Structure

### Core Types (`core.ts`)
Contains foundational types used across the application:
- Base document types
- User authentication
- Business profile
- Employee core structure

### Module & Marketplace Types (`modules.ts`) 
Contains types related to the modular structure of the application:
- Module definitions
- Module enablement records
- Settings for different business types (F&B, Retail, Service)
- Business templates for quick setup

### Inventory Management (`inventory.ts` & `inventory-v2.ts`)
Contains types for product and inventory management:
- Products and categories
- Suppliers
- Stock movements and alerts
- Product variants (for retail)
- Recipe management (for F&B)

### POS & Sales (`pos.ts`)
Contains types for point-of-sale functionality:
- Transactions and payments
- Orders and line items
- Customers
- Table management (for F&B)
- Reservations

### Employee Management (`employees.ts`)
Contains types for managing staff:
- Roles and permissions
- Shifts and scheduling
- Time tracking

### Financial Management (`financial.ts`)
Contains types for financial records:
- Income and expenses
- Financial accounts
- Budgeting
- Invoices and payments

### Database Schema (`schema.ts`)
Contains the actual Firestore document types:
- Maps domain models to database structure
- Includes Firestore-specific fields
- Query options and operations

## Usage Guidelines

1. When adding new types, place them in the appropriate domain file
2. Maintain backward compatibility when modifying existing types
3. Export new types through the `index.ts` file
4. Prefer namespaced imports for domains with type conflicts
5. Keep database schema types in sync with actual Firestore collections

## Import Examples

```typescript
// Import all types (may cause naming conflicts)
import * as Types from '../types';

// Import specific domains to avoid conflicts
import { InventoryV2, EmployeeTypes } from '../types';
import type { Business, User, CreateDocument, UpdateDocument } from '../types/core';
import type { Transaction } from '../types/pos';

// Use types in your code
const business: Business = { /* ... */ };
const product: InventoryV2.Product = { /* ... */ };
const role: EmployeeTypes.Role = { /* ... */ };

// Firestore helpers
import { convertToFirestore, convertForUpdate } from '../types/firestore-utils';

// Creating new documents
const newBusiness: CreateDocument<Business> = {
  business_name: 'Coffee Shop',
  business_type: 'f&b',
  // ... other fields
  is_active: true
};

// Updating existing documents
const updateData: UpdateDocument<Business> = {
  id: 'business-123',
  business_name: 'Updated Coffee Shop'
};

// Convert for Firestore operations
const firestoreData = convertToFirestore(newBusiness);
const updateFirestoreData = convertForUpdate(updateData);
```

## Firestore Integration

For details on integrating these types with Firebase Firestore, see the [Firestore guide](./FIRESTORE.md) and the [Firestore service example](../lib/firestore-service.ts).
