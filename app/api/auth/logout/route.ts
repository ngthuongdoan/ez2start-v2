import { NextResponse } from "next/server";
import { removeTokenCookie } from "@/lib/cookies-server";

export async function POST() {
  removeTokenCookie();
  return NextResponse.json({ message: "Logged out" });
}