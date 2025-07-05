import { verifyServerSession } from './verifyToken';

export async function getServerAuthStatus() {
  try {
    const decodedToken = await verifyServerSession();

    if (!decodedToken) {
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        // Add other user properties as needed
      }
    };
  } catch (error) {
    console.error('Server auth check failed:', error);
    return { isAuthenticated: false, user: null };
  }
}
