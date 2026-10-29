"use client";
import { useState, useEffect } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STATUS_FLOW: Record<string, string | null> = {
  "New": "Contacted",
  "Contacted": "Won",
  "Won": null,
  "Lost": null,
};

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800 border-blue-200",
  "Contacted": "bg-amber-100 text-amber-800 border-amber-200",
  "Won": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Lost": "bg-rose-100 text-rose-800 border-rose-200",
};

type Lead = {
  id: string;
  name: string;
  source: string;
  contact: string;
  notes: string;
  status: string;
  createdAt: string;
};

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/leads").then((r) => r.json()).then(setLeads);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, source, contact, notes }),
    });
    const lead = await res.json();
    setLeads((prev) => [lead, ...prev]);
    setName("");
    setSource("");
    setContact("");
    setNotes("");
  }

  async function handleAdvance(id: string, currentStatus: string) {
    const nextStatus = STATUS_FLOW[currentStatus];
    if (!nextStatus) return;
    const res = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const updated = await res.json();
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground rounded-lg p-2.5 shadow-sm">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">Track leads through New → Contacted → Won / Lost</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Add a new lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
            <Input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
            <div className="flex gap-2 md:col-span-2 lg:col-span-4">
              <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1" />
              <Button type="submit">Add Lead</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["New", "Contacted", "Won", "Lost"].map((status) => (
          <Card key={status} className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{status}</h3>
                <Badge className={STATUS_COLORS[status] || ""}>{leads.filter((l) => l.status === status).length}</Badge>
              </div>
              <div className="space-y-3">
                {leads.filter((l) => l.status === status).map((lead) => (
                  <div key={lead.id} className="rounded-lg border bg-card p-3 shadow-sm space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.source || "No source"}</p>
                      </div>
                      <Badge className={STATUS_COLORS[lead.status] || ""}>{lead.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p><span className="font-medium">Contact:</span> {lead.contact || "—"}</p>
                      <p><span className="font-medium">Notes:</span> {lead.notes || "—"}</p>
                    </div>
                    <div className="pt-1">
                      {STATUS_FLOW[lead.status] ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs gap-1.5"
                          onClick={() => handleAdvance(lead.id, lead.status)}
                        >
                          Advance <ArrowRight className="h-3 w-3" />
                        </Button>
                      ) : (
                        <p className="text-[10px] text-center text-muted-foreground">Final status</p>
                      )}
                    </div>
                  </div>
                ))}
                {leads.filter((l) => l.status === status).length === 0 && (
                  <p className="text-xs text-muted-foreground">No leads in {status}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
