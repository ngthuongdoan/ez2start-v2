import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    await sendPasswordResetEmail(auth, email);
    return NextResponse.json({ message: "Password reset email sent." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}