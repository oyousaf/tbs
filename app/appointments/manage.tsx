"use client";

import Link from "next/link";
import { useState } from "react";
import { AppointmentCard } from "@/components/appointment-card";
import {
  addDays,
  cancellationFee,
  clock,
  dateKey,
  findSlots,
  longDate,
  openingFor,
  shortDate,
  type Appointment,
} from "@/lib/engine";
import { gbp, servicesFor } from "@/lib/menu";
import { actions, useNow, useStore } from "@/lib/store";

function Reschedule({ a, now, onDone }: { a: Appointment; now: number; onDone: () => void }) {
  const state = useStore();
  const list = servicesFor(a.legs.map((l) => l.serviceId));
  const today = dateKey(new Date(now));
  const dates = Array.from({ length: 28 }, (_, i) => addDays(today, i)).filter((d) => openingFor(d));
  const [date, setDate] = useState(a.date >= today ? a.date : dates[0]);
  const therapist = new Set(a.legs.map((l) => l.therapistId)).size === 1 ? a.legs[0].therapistId : "any";
  let slots = findSlots(date, list, therapist, state, now, a.id);
  if (!slots.length) slots = findSlots(date, list, "any", state, now, a.id);
  return (
    <div className="mt-3 rounded-2xl border-[1.5px] border-line p-4">
      <label htmlFor={`d-${a.id}`} className="mb-1 block font-semibold">New date</label>
      <select id={`d-${a.id}`} value={date} onChange={(e) => setDate(e.target.value)} className="field max-w-xs">
        {dates.map((d) => (
          <option key={d} value={d}>{shortDate(d)}</option>
        ))}
      </select>
      <p className="mt-3 font-semibold">New time on {longDate(date)}</p>
      {slots.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {slots.filter((s) => s.start % 30 === 0).slice(0, 18).map((s) => (
            <li key={s.start}>
              <button
                type="button"
                className="btn btn-line px-4! text-sm tabular-nums"
                onClick={() => {
                  actions.updateAppointment(a.id, { date, legs: s.legs });
                  onDone();
                }}
              >
                {clock(s.start)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-muted">No times that day. Try another date.</p>
      )}
    </div>
  );
}

export function Manage() {
  const { appointments } = useStore();
  const now = useNow();
  const [moving, setMoving] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  if (now === null) return <div className="min-h-80" />;
  const live = appointments.filter((a) => a.status === "confirmed");

  if (!live.length) {
    return (
      <div className="wrap-page py-16">
        <p className="text-lg">You don&rsquo;t have any appointments yet. {appointments.length > 0 && "Your cancelled appointments have been cleared from this list."}</p>
        <Link href="/book" className="btn btn-plum mt-5">Find a time</Link>
      </div>
    );
  }

  return (
    <div className="wrap-page max-w-3xl space-y-10 py-12">
      <p className="text-muted">These are preview appointments, saved only in this browser.</p>
      {live.map((a) => {
        const fee = cancellationFee(a, now);
        return (
          <div key={a.id}>
            <AppointmentCard appointment={a} />
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="btn btn-plum" aria-expanded={moving === a.id} onClick={() => setMoving(moving === a.id ? null : a.id)}>
                Change date or time
              </button>
              <button type="button" className="btn btn-line" aria-expanded={cancelling === a.id} onClick={() => setCancelling(cancelling === a.id ? null : a.id)}>
                Cancel appointment
              </button>
            </div>
            {moving === a.id && <Reschedule a={a} now={now} onDone={() => setMoving(null)} />}
            {cancelling === a.id && (
              <div role="alert" className="mt-3 rounded-2xl border-2 border-accent p-4">
                {fee.within ? (
                  <p>This appointment is less than 24 hours away, so the salon&rsquo;s <strong>50% cancellation fee of {gbp(fee.pence)}</strong> would apply. Nothing is charged in this preview.</p>
                ) : (
                  <p>You&rsquo;re outside the 24-hour window, so there&rsquo;s <strong>no fee</strong> to cancel.</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3">
                  <button type="button" className="btn bg-clay-solid text-porcelain hover:bg-aubergine" onClick={() => { actions.updateAppointment(a.id, { status: "cancelled" }); setCancelling(null); }}>
                    Yes, cancel it
                  </button>
                  <button type="button" className="btn btn-line" onClick={() => setCancelling(null)}>Keep my appointment</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
