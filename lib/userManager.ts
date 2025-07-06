import { adminDb } from './firebaseAdmin';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add any additional fields you want to store
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
  };
}

export interface CreateUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

/**
 * Create or update user document in Firestore
 */
export async function createOrUpdateUser(userData: CreateUserData): Promise<UserData> {
  try {
    const userRef = adminDb.collection('users').doc(userData.uid);
    const userDoc = await userRef.get();

    const now = new Date();

    // Remove undefined fields before writing to Firestore
    const clean = <T extends object>(obj: T): T => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
      ) as T;
    };

    if (userDoc.exists) {
      // Update existing user
      const updateData = clean({
        ...userData,
        updatedAt: now,
      });

      await userRef.update(updateData);

      // Return updated user data
      const updatedDoc = await userRef.get();
      return updatedDoc.data() as UserData;
    } else {
      // Create new user
      const newUserData: UserData = clean({
        ...userData,
        createdAt: now,
        updatedAt: now,
        role: userData.role || 'user', // default role
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
        }
      });

      await userRef.set(newUserData);
      return newUserData;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid?: string): Promise<UserData | null> {
  if (!uid) {
    console.error('Invalid UID provided to getUserData');
    return null;
  }
  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return userDoc.data() as UserData;
    }

    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  uid?: string,
  preferences?: Partial<UserData['preferences']>
): Promise<void> {
  if (!uid) {
    console.error('Invalid UID provided to updateUserPreferences');
    return;
  }
  try {
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.update({
      preferences: preferences,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

/**
 * Delete user data from Firestore
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.delete();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
