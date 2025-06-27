import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setTokenCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setTokenCookie(token);
    return NextResponse.json({ message: "Account created" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}