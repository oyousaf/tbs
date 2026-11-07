"use client";

import { useState } from "react";
import { sampleClients } from "@/lib/engine";
import { services, gbp } from "@/lib/menu";
import { therapists } from "@/lib/people";
import { useStore } from "@/lib/store";

/** Fictional records, derived predictably from the name so they stay stable between visits. */
const record = (name: string, i: number) => {
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const svc = services.filter((s) => s.pence > 0 && s.pence < 12000)[code % 60];
  const visits = 2 + (code % 23);
  return {
    name,
    visits,
    points: visits * 38 + (i % 5) * 20,
    last: svc?.name ?? "Treatment",
    spend: visits * (svc?.pence ?? 4000),
    therapist: therapists[code % therapists.length].name,
  };
};

export function ClientsPanel() {
  const { appointments } = useStore();
  const [q, setQ] = useState("");
  const online = [...new Set(appointments.filter((a) => a.status === "confirmed").map((a) => a.client.name))];
  const rows = sampleClients.map(record).filter((r) => r.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="rounded-3xl bg-page p-4 sm:p-6">
      <label htmlFor="client-q" className="mb-1 block font-semibold">Find a client</label>
      <input id="client-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field max-w-sm" />
      {online.length > 0 && (
        <p className="mt-3 text-sm">Booked online in this browser: <strong>{online.join(", ")}</strong></p>
      )}
      <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Client records">
        <table className="w-full min-w-160 text-left">
          <caption className="sr-only">Sample client records, all fictional</caption>
          <thead>
            <tr className="border-b-2 border-accent/25 text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">Client</th>
              <th scope="col" className="py-2 pr-4 font-medium">Last treatment</th>
              <th scope="col" className="py-2 pr-4 font-medium">Usually sees</th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">Visits</th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">Spend</th>
              <th scope="col" className="py-2 text-right font-medium">Treat Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-accent/10">
                <th scope="row" className="py-2.5 pr-4 font-semibold">{r.name}</th>
                <td className="py-2.5 pr-4">{r.last}</td>
                <td className="py-2.5 pr-4">{r.therapist}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{r.visits}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{gbp(r.spend)}</td>
                <td className="py-2.5 text-right tabular-nums">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
