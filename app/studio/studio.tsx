"use client";

import { useState } from "react";
import { Pills, Swap } from "@/components/tabs";
import { addDays, dateKey, getDiary, largestGap, clock, longDate, openingFor } from "@/lib/engine";
import { gbp } from "@/lib/menu";
import { therapistById } from "@/lib/people";
import { useNow, useStore } from "@/lib/store";
import { ClientsPanel } from "./clients";
import { Diary } from "./diary";
import { WaitlistPanel, sampleWaitlist } from "./waitlist";

const tabs = ["Diary", "Waitlist", "Clients"] as const;

export function Studio() {
  const state = useStore();
  const now = useNow();
  const [offset, setOffset] = useState<number | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Diary");

  if (now === null) return <div className="min-h-screen" />;

  const today = dateKey(new Date(now));
  // Open on the next day the salon is open, so the diary is never empty on arrival.
  let start = 0;
  while (!openingFor(addDays(today, start))) start++;
  const dayOffset = offset ?? start;
  const date = addDays(today, dayOffset);
  const items = getDiary(date, state);
  const clients = items.filter((i) => i.source !== "block" && i.status !== "noshow");
  const takings = clients.reduce((a, i) => a + i.pence, 0);
  const gap = largestGap(date, items);
  const waiting = sampleWaitlist(today).length + state.waitlist.length;

  const brief = !openingFor(date)
    ? "The salon is closed today."
    : `${clients.length} treatments booked, worth ${gbp(takings)}. ${
        gap
          ? `The biggest gap is ${clock(gap.start)} to ${clock(gap.end)} with ${therapistById.get(gap.therapistId)?.name}${waiting ? `, and ${waiting} ${waiting === 1 ? "person is" : "people are"} on the waitlist` : ""}.`
          : "The day is full."
      }`;

  const shift = (n: number) => {
    let next = dayOffset + n;
    while (next >= 0 && !openingFor(addDays(today, next))) next += n;
    if (next >= 0) setOffset(next);
  };

  return (
    <div className="bg-panel/40">
      <div className="wrap-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-medium text-muted">Salon view · sample diary with fictional clients</p>
            <h1 className="mt-1 font-display text-5xl text-accent sm:text-6xl">{longDate(date)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-line px-4!" disabled={dayOffset <= start} onClick={() => shift(-1)}>Previous day</button>
            <button type="button" className="btn btn-line px-4!" onClick={() => setOffset(start)}>First open day</button>
            <button type="button" className="btn btn-line px-4!" onClick={() => shift(1)}>Next day</button>
          </div>
        </div>

        <section aria-label="Day brief" className="on-dark mt-6 rounded-3xl bg-plum p-5 text-porcelain sm:p-6">
          <h2 className="text-sm font-medium text-champagne">Day brief</h2>
          <p className="mt-1 max-w-4xl font-display text-2xl leading-snug" aria-live="polite">{brief}</p>
        </section>

        <div className="mt-6">
          <Pills
            group="studio-tab"
            kind="tab"
            label="Salon tools"
            value={tab}
            onChange={(t) => setTab(t as (typeof tabs)[number])}
            options={tabs.map((t) => ({ id: t, label: t === "Waitlist" ? `${t} (${waiting})` : t }))}
          />
        </div>

        <div role="tabpanel" aria-label={tab} className="mt-5">
          <Swap id={tab === "Diary" ? `Diary-${date}` : tab}>
            {tab === "Diary" && <Diary date={date} items={items} />}
            {tab === "Waitlist" && <WaitlistPanel today={today} />}
            {tab === "Clients" && <ClientsPanel />}
          </Swap>
        </div>
      </div>
    </div>
  );
}
