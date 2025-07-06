import { NextRequest, NextResponse } from "next/server";
import { getServerAuthStatus } from "@/lib/auth-server";
import { updateUserPreferences } from "@/lib/userManager";

export async function PUT(req: NextRequest) {
  try {
    const authStatus = await getServerAuthStatus();

    if (!authStatus.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await req.json();

    await updateUserPreferences(authStatus.user?.uid, preferences);

    return NextResponse.json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
