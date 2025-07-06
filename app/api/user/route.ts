import { NextRequest, NextResponse } from "next/server";
import { getServerAuthStatus } from "@/lib/auth-server";
import { getUserData, createOrUpdateUser } from "@/lib/userManager";

export async function GET(req: NextRequest) {
  try {
    const authStatus = await getServerAuthStatus();

    if (!authStatus.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await getUserData(authStatus.user?.uid);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authStatus = await getServerAuthStatus();

    if (!authStatus.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await req.json();

    // Ensure user can only update their own data
    const userData = await createOrUpdateUser({
      uid: authStatus.user?.uid,
      email: authStatus.user?.email,
      ...updateData,
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
