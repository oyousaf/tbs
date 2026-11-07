"use client";

import Link from "next/link";
import { clock, shortDate, soonest } from "@/lib/engine";
import { duration, gbp, servicesFor } from "@/lib/menu";
import { actions, useNow, useStore } from "@/lib/store";

const picks = ["gel-mani", "back-neck", "express-facial", "lvl"];

/** Next free times, read from the same engine that powers the booking flow. */
export function NextFree() {
  const state = useStore();
  const now = useNow();
  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl bg-accent/20 sm:grid-cols-2 xl:grid-cols-4">
      {picks.map((id) => {
        const [svc] = servicesFor([id]);
        const next = now === null ? null : soonest([svc], "any", state, now, 21);
        return (
          <li key={id} className="flex min-h-56 flex-col bg-page p-6">
            <p className="text-sm text-muted">
              {duration(svc.minutes)} · {gbp(svc.pence)}
            </p>
            <h3 className="mt-1 font-display text-2xl text-accent">{svc.name}</h3>
            <p className="mt-auto pt-6 text-sm text-muted">Next free</p>
            <p className="min-h-7 text-lg font-semibold tabular-nums">
              {next ? `${shortDate(next.date)}, ${clock(next.slot.start)}` : ""}
            </p>
            <Link
              href="/book?step=therapist"
              onClick={() => actions.setTray([id])}
              className="btn btn-line mt-4 self-start text-sm"
            >
              Book this<span className="sr-only">: {svc.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
