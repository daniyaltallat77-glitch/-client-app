import { NextRequest, NextResponse } from "next/server";
import { createLead, getLeads } from "@/lib/leads";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = await createLead({
      name: body.name || "",
      source: body.source || "",
      contact: body.contact || "",
      notes: body.notes || "",
    });
    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
