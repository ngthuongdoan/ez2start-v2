import { NextResponse } from "next/server";
import { removeTokenCookie } from "@/lib/cookies-server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST() {
  removeTokenCookie();
  return NextResponse.json({ message: "Logged out" });
}