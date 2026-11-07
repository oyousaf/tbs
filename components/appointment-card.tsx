"use client";

import { buildIcs, clock, longDate, type Appointment } from "@/lib/engine";
import { gbp, serviceById } from "@/lib/menu";
import { therapistById } from "@/lib/people";
import { business } from "@/lib/site";

export function AppointmentCard({ appointment: a }: { appointment: Appointment }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(a)], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `the-beauty-spot-${a.ref}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <article className="rounded-3xl bg-panel p-6 sm:p-8">
      <p className="text-sm font-medium text-muted">Preview reference {a.ref}</p>
      <h2 className="mt-1 font-display text-3xl text-accent sm:text-4xl">{longDate(a.date)}, {clock(a.legs[0].start)}</h2>
      <ul className="mt-5 divide-y divide-accent/15">
        {a.legs.map((l) => {
          const s = serviceById.get(l.serviceId);
          return (
            <li key={`${l.serviceId}${l.start}`} className="flex flex-wrap justify-between gap-x-4 py-2.5">
              <span>
                <span className="font-semibold">{s?.name}</span>
                <span className="block text-sm text-muted">{clock(l.start)} to {clock(l.end)} with {therapistById.get(l.therapistId)?.name}</span>
              </span>
              <span className="font-medium tabular-nums">{gbp(s?.pence ?? 0)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex justify-between border-t-2 border-accent/30 pt-3 text-lg font-semibold">
        <span>Total to pay in salon</span>
        <span className="tabular-nums">{gbp(a.pence)}</span>
      </p>
      <p className="mt-3 text-sm text-muted">{business.street}, {business.town}, {business.postcode}</p>
      <button type="button" onClick={download} className="btn btn-line mt-5">Add to calendar</button>
    </article>
  );
}
