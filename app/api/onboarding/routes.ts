import { initializeTenant } from "@/lib/initTenant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, ownerUid, businessData } = body;

    // Create user & initialize tenant
    const result = await initializeTenant(
      businessId,
      ownerUid,
      businessData
    );

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}