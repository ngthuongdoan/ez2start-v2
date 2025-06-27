import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setTokenCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setTokenCookie(token);
    return NextResponse.json({ message: "Logged in" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}