import { promises as fs } from "fs";
import path from "path";

export type LeadStatus = "New" | "Contacted" | "Won" | "Lost";

export interface Lead {
  id: string;
  name: string;
  source: string;
  contact: string;
  notes: string;
  status: LeadStatus;
  createdAt: string;
}

export const VALID_STATUSES: LeadStatus[] = ["New", "Contacted", "Won", "Lost"];

const DATA_FILE = path.join(process.cwd(), ".data", "leads.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  } catch {}
}

async function readLeads(): Promise<Lead[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function getLeads(): Promise<Lead[]> {
  return readLeads();
}

export async function getLead(id: string): Promise<Lead | null> {
  const leads = await readLeads();
  return leads.find((l) => l.id === id) || null;
}

export async function createLead(lead: Omit<Lead, "id" | "status" | "createdAt">): Promise<Lead> {
  const leads = await readLeads();
  const newLead: Lead = {
    ...lead,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    status: "New",
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  await writeLeads(leads);
  return newLead;
}

export async function updateStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await writeLeads(leads);
  return lead;
}
