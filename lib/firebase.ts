import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { createFirestoreConverter } from "../types/firestore-utils";
import { 
  UserDocument, 
  BusinessDocument, 
  EmployeeDocument,
  ProductDocument,
  CategoryDocument,
  SupplierDocument,
  CustomerDocument,
  TransactionDocument
} from "../types/schema";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence when in browser environment
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    console.error("Firebase persistence error:", err.code);
  });
}

// Create type converters
const userConverter = createFirestoreConverter<UserDocument>();
const businessConverter = createFirestoreConverter<BusinessDocument>();
const employeeConverter = createFirestoreConverter<EmployeeDocument>();
const productConverter = createFirestoreConverter<ProductDocument>();
const categoryConverter = createFirestoreConverter<CategoryDocument>();
const supplierConverter = createFirestoreConverter<SupplierDocument>();
const customerConverter = createFirestoreConverter<CustomerDocument>();
const transactionConverter = createFirestoreConverter<TransactionDocument>();

// Define collection references with type converters
const collections = {
  // Root collections
  users: collection(db, 'users').withConverter(userConverter),
  businesses: collection(db, 'businesses').withConverter(businessConverter),
  
  // Business subcollection generator functions
  getEmployeesCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/employees`).withConverter(employeeConverter),
  
  getProductsCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/products`).withConverter(productConverter),
  
  getCategoriesCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/categories`).withConverter(categoryConverter),
  
  getSuppliersCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/suppliers`).withConverter(supplierConverter),
  
  getCustomersCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/customers`).withConverter(customerConverter),
  
  getTransactionsCollection: (businessId: string) => 
    collection(db, `businesses/${businessId}/transactions`).withConverter(transactionConverter),
};

// Legacy collection references (for backward compatibility)
const legacyCollections = {
  employees: collection(db, 'employees'),
};

export { 
  auth, 
  app, 
  db, 
  storage, 
  collections,
  legacyCollections,
  userConverter,
  businessConverter,
  employeeConverter,
  productConverter,
  categoryConverter,
  supplierConverter,
  customerConverter,
  transactionConverter
};