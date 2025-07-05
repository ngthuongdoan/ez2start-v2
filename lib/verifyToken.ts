import { adminAuth } from "./firebaseAdmin";
import { getTokenCookie } from "./cookies-server";

export async function verifyServerSession() {
  const token = getTokenCookie();
  if (!token) return null;
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}