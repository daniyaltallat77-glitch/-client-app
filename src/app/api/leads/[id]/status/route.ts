import { NextRequest, NextResponse } from "next/server";
import { updateStatus, VALID_STATUSES, LeadStatus } from "@/lib/leads";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const newStatus = body.status;
    if (!VALID_STATUSES.includes(newStatus as LeadStatus)) {
      return NextResponse.json(
        { error: "Invalid status", allowed: VALID_STATUSES },
        { status: 400 }
      );
    }
    const updated = await updateStatus(id, newStatus as LeadStatus);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
