import { NextRequest, NextResponse } from "next/server";
import { getServerAuthStatus } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const authStatus = await getServerAuthStatus();
    return NextResponse.json(authStatus);
  } catch (error) {
    console.error('Auth check API failed:', error);
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
