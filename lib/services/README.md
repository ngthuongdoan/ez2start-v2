# Services Implementation Guide

This document provides an overview of the service layer implementation in the ez2start-v2 project. The service layer is responsible for providing a clean API for interacting with the Firestore database.

## Service Architecture

We've implemented a service layer with the following components:

1. **Base FirestoreService**: Generic utility class with common Firestore operations
2. **TypedFirestoreService**: Enhanced service with proper TypeScript typing
3. **Domain-specific Services**: Business logic for each domain entity
4. **ServiceFactory**: A factory pattern for creating properly typed services

## Using Services

### Option 1: Domain-specific Service Classes

Use the specialized service classes for domain-specific operations. These classes provide methods tailored to specific business needs.

```typescript
// Example: Using the BusinessService
import { BusinessService } from '@/lib/services/business.service';

// Get a business by ID
const business = await BusinessService.getBusinessById('business-123');

// Create a new business
const newBusiness = await BusinessService.createBusiness({
  owner_uid: 'user-123',
  business_name: 'My Business',
  business_type: 'retail',
  enabled_modules: ['inventory', 'pos']
});
```

### Option 2: ServiceFactory Pattern

Use the ServiceFactory for a consistent, type-safe approach to access any collection:

```typescript
// Example: Using the ServiceFactory
import { ServiceFactory } from '@/lib/services/service-factory';

// Get a business service
const businessService = ServiceFactory.business();

// Get all products for a business
const productService = ServiceFactory.products('business-123');
const productsResult = await productService.getDocuments();

// Create a new product
await productService.createDocument({
  name: 'Product Name',
  price: 29.99,
  category_id: 'category-123',
  business_id: 'business-123',
  sku: 'PRD-001'
});
```

## Type Safety

All services provide full TypeScript type safety. When you create a document, the service will ensure that all required fields are present and correctly typed:

```typescript
// The compiler will enforce the correct type
const employeeService = ServiceFactory.employees('business-123');

// This will show type errors if required fields are missing
await employeeService.createDocument({
  business_id: 'business-123',
  name: 'John Doe',
  role: 'manager',
  email: 'john@example.com'
});
```

## Error Handling

Services provide consistent error handling. All methods return Promises that you should properly handle with try/catch:

```typescript
try {
  await productService.createDocument({
    name: 'Product Name',
    price: 29.99,
    category_id: 'category-123',
    business_id: 'business-123',
    sku: 'PRD-001'
  });
} catch (error) {
  console.error('Failed to create product:', error);
  // Handle the error appropriately
}
```

## Extending Services

To add functionality to a domain-specific service:

1. Add methods to the appropriate service class (e.g., `ProductService`)
2. For common patterns across services, extend the `TypedFirestoreService` class

## Performance Considerations

- Use the `filters` and pagination options for efficient queries
- Consider batch operations for bulk updates
- Add appropriate Firestore indexes for complex queries
