import { verifyServerSession } from './verifyToken';
import { getUserData } from './userManager';

export async function getServerAuthStatus() {
  try {
    const decodedToken = await verifyServerSession();

    if (!decodedToken) {
      return { isAuthenticated: false, user: null };
    }

    // Get additional user data from Firestore
    const firestoreUser = await getUserData(decodedToken.uid);

    return {
      isAuthenticated: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || firestoreUser?.displayName,
        photoURL: decodedToken.picture || firestoreUser?.photoURL,
        // Include additional Firestore data
        firstName: firestoreUser?.firstName,
        lastName: firestoreUser?.lastName,
        phoneNumber: firestoreUser?.phoneNumber,
        role: firestoreUser?.role,
        preferences: firestoreUser?.preferences,
        createdAt: firestoreUser?.createdAt,
        updatedAt: firestoreUser?.updatedAt,
      }
    };
  } catch (error) {
    console.error('Server auth check failed:', error);
    return { isAuthenticated: false, user: null };
  }
}
