import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setTokenCookie } from "@/lib/cookies-server";
import { createOrUpdateUser } from "@/lib/userManager";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    // Set the auth cookie
    setTokenCookie(token);

    // Create or update user in Firestore
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      phoneNumber: user.phoneNumber || undefined,
    });

    return NextResponse.json({
      message: "Logged in successfully",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}