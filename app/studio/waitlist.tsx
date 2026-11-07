"use client";

import { addDays, clock, findSlots, shortDate, type WaitEntry } from "@/lib/engine";
import { gbp, servicesFor } from "@/lib/menu";
import { actions, useNow, useStore } from "@/lib/store";

export const sampleWaitlist = (today: string): WaitEntry[] => [
  { id: "sw1", date: addDays(today, 3), part: "evening", name: "Tess Marlow", phone: "07700 900142", serviceIds: ["gel-mani"] },
  { id: "sw2", date: addDays(today, 5), part: "morning", name: "Anita Fenn", phone: "07700 900187", serviceIds: ["hd-lift"] },
  { id: "sw3", date: addDays(today, 6), part: "any time", name: "Rosalind Keyes", phone: "07700 900115", serviceIds: ["back-neck", "pedi"] },
];

export function WaitlistPanel({ today }: { today: string }) {
  const state = useStore();
  const now = useNow();
  if (now === null) return null;
  const entries = [...state.waitlist, ...sampleWaitlist(today)];
  return (
    <div>
      <p className="mb-4 max-w-2xl text-muted">
        When a space opens, the system matches it to people waiting and drafts the message. Nothing goes out until a member of staff approves it.
      </p>
      <ul className="grid gap-4 lg:grid-cols-2">
        {entries.map((w) => {
          const list = servicesFor(w.serviceIds);
          const slot = findSlots(w.date, list, "any", state, now).find(
            (s) => w.part === "any time" || (w.part === "morning" ? s.start < 720 : w.part === "afternoon" ? s.start >= 720 && s.start < 1020 : s.start >= 1020),
          );
          const first = w.name.split(" ")[0];
          const treatment = list.map((s) => s.name).join(" and ");
          return (
            <li key={w.id} className="rounded-3xl bg-page p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl text-accent">{w.name}</h3>
                <p className="text-sm text-muted">{shortDate(w.date)}, {w.part}</p>
              </div>
              <p className="mt-1">{treatment} <span className="text-muted">({gbp(list.reduce((a, s) => a + s.pence, 0))})</span></p>
              {slot ? (
                <>
                  <p className="mt-3 text-sm font-semibold text-sage">Space found: {clock(slot.start)}</p>
                  <div className="mt-2 rounded-2xl bg-panel p-3 text-sm">
                    <p className="text-xs font-medium text-muted">Suggested message</p>
                    <p className="mt-1">Hi {first}, good news! A space has opened for your {treatment} on {shortDate(w.date)} at {clock(slot.start)}. Would you like it? Just reply YES and we&rsquo;ll pop you in. The Beauty Spot</p>
                  </div>
                  {w.approved ? (
                    <p role="status" className="mt-3 text-sm font-semibold text-sage">Approved. Preview only, so nothing was sent.</p>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-plum mt-3 text-sm"
                      onClick={() => {
                        if (!state.waitlist.some((x) => x.id === w.id)) actions.addWait(w);
                        actions.approveWait(w.id);
                      }}
                    >
                      Approve message for {first}
                    </button>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No matching space yet. We&rsquo;ll flag it as soon as one opens.</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
