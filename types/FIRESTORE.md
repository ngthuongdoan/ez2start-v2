# Firestore Best Practices for ez2start

This guide outlines how to effectively use Firebase Firestore with the ez2start type system.

## Firestore Structure

The ez2start database follows this collection structure:

```
- users
  - {userId}
    
- businesses
  - {businessId}
    - employees
      - {employeeId}
    
    - products
      - {productId}
    
    - categories
      - {categoryId}
    
    - suppliers
      - {supplierId}
    
    - customers
      - {customerId}
    
    - transactions
      - {transactionId}
        - line_items (subcollection)
          - {lineItemId}
    
    - orders
      - {orderId}
    
    - financial_records
      - {recordId}
    
    - module_enablements
      - {enablementId}
```

## Type System Integration

### Using Document Types

```typescript
import { UserDocument, BusinessDocument } from '../types/schema';
import { createFirestoreConverter } from '../types/firestore-utils';

// Create converters for your collections
const userConverter = createFirestoreConverter<UserDocument>();
const businessConverter = createFirestoreConverter<BusinessDocument>();

// Use the converters with Firestore collections
const usersCollection = collection(db, 'users').withConverter(userConverter);
const businessesCollection = collection(db, 'businesses').withConverter(businessConverter);

// Get a typed document
const userDoc = await getDoc(doc(usersCollection, userId));
const user = userDoc.data(); // Properly typed as UserDocument
```

### Creating and Updating Documents

```typescript
import { convertToFirestore, convertForUpdate } from '../types/firestore-utils';
import { CreateDocument, UpdateDocument } from '../types/core';
import { BusinessDocument } from '../types/schema';

// Create a new business
const newBusiness: CreateDocument<BusinessDocument> = {
  owner_uid: currentUser.uid,
  business_name: 'My Business',
  business_type: 'retail',
  enabled_modules: ['pos', 'inventory'],
  module_settings: {},
  is_active: true,
  search_terms: ['my business', 'retail', 'my']
};

// Convert to Firestore format and save
const firestoreData = convertToFirestore(newBusiness);
const docRef = await addDoc(collection(db, 'businesses'), firestoreData);

// Update a business
const updateData: UpdateDocument<BusinessDocument> = {
  id: businessId,
  business_name: 'Updated Name',
  phone: '555-1234'
};

// Convert for update and save
const updateFirestoreData = convertForUpdate(updateData);
await updateDoc(doc(db, 'businesses', businessId), updateFirestoreData);
```

## Query Optimization

### Indexing Considerations

When creating queries, be mindful of Firestore indexing requirements:

1. **Compound Queries**: Create composite indexes for fields used together in filters
2. **Array Contains**: Limit `array-contains` queries to one per query
3. **Range Filters**: Only one field can have a range filter (>, <, >=, <=)

### Query Examples

```typescript
// Efficient queries using the type system
const activeProductsQuery = query(
  collection(db, `businesses/${businessId}/products`),
  where('is_active', '==', true),
  where('stock_quantity', '>', 0),
  orderBy('stock_quantity', 'asc'),
  limit(20)
).withConverter(productConverter);

// Get low stock products
const products = await getDocs(activeProductsQuery);
const typedProducts: ProductDocument[] = products.docs.map(doc => doc.data());
```

## Batch Operations

For consistency when updating related documents, use batched writes:

```typescript
// Create a batch
const batch = writeBatch(db);

// Add multiple operations
batch.set(doc(db, 'businesses', businessId), convertToFirestore(newBusiness));
batch.update(doc(db, `businesses/${businessId}/products`, productId), 
  convertForUpdate({ id: productId, stock_quantity: 15 }));
batch.delete(doc(db, `businesses/${businessId}/products`, deletedProductId));

// Commit the batch
await batch.commit();
```

## Firestore Security Rules

Structure your security rules around the business hierarchy:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can read their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Business rules
    match /businesses/{businessId} {
      // Allow access if user is owner or employee
      function isBusinessMember() {
        return request.auth.uid == resource.data.owner_uid || 
               exists(/databases/$(database)/documents/businesses/$(businessId)/employees/$(request.auth.uid));
      }
      
      // Business document
      allow read: if isBusinessMember();
      allow update: if request.auth.uid == resource.data.owner_uid;
      allow create: if request.auth.uid == request.resource.data.owner_uid;
      
      // Business subcollections
      match /{subcollection}/{docId} {
        allow read: if isBusinessMember();
        allow write: if isBusinessMember();
      }
    }
  }
}
```

## Performance Tips

1. **Denormalize When Needed**: Store frequently accessed data together
2. **Use Document IDs Wisely**: Consider using meaningful IDs for easier retrieval
3. **Minimize Document Reads**: Fetch only what you need with field selections
4. **Offline Support**: Configure persistence for offline-first functionality
5. **Batch Operations**: Use batched writes for related updates

## Data Migration Strategy

When updating types or schemas:

1. Use Cloud Functions to migrate data in batches
2. Version your data models with a schema_version field
3. Handle both old and new schemas in your application during transition periods
