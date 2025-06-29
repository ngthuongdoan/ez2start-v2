import { App, getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
let _adminApp: App | undefined;

const serviceAccount = JSON.parse(process.env.FIREBASE_CERT as string);

if (!getApps().length) {
  _adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
}
export const adminApp = _adminApp;
export const adminAuth = getAuth();