import { App, getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from '@/firebase-cert.json';
let _adminApp: App | undefined;

if (!getApps().length) {
  _adminApp = initializeApp({
    credential: cert(serviceAccount as any),
  });
}
export const adminApp = _adminApp;
export const adminAuth = getAuth();