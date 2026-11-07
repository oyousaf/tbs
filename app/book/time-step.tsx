"use client";

import { useState } from "react";
import { Pills, Swap } from "@/components/tabs";
import {
  addDays,
  clock,
  dateKey,
  findSlots,
  HORIZON_DAYS,
  longDate,
  openingFor,
  parseDate,
  partOf,
  shortDate,
  soonest,
  type Slot,
} from "@/lib/engine";
import { serviceById, type Service } from "@/lib/menu";
import { therapistById } from "@/lib/people";
import { actions, useNow, useStore } from "@/lib/store";
import type { Chosen } from "./flow";

const HOLD_MS = 5 * 60 * 1000;
const parts = ["morning", "afternoon", "evening"] as const;
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Reduce a busy day to on-the-hour and half-hour choices, keeping any others if that leaves few. */
const tidy = (slots: Slot[]) => {
  const round = slots.filter((s) => s.start % 30 === 0);
  return round.length >= 4 ? round : slots;
};

export function TimeStep({
  list,
  prefer,
  chosen,
  onChoose,
  onNext,
}: {
  list: Service[];
  prefer: { day: number | null; part: string | null };
  chosen: Chosen | null;
  onChoose: (c: Chosen) => void;
  onNext: () => void;
}) {
  const state = useStore();
  const now = useNow();
  const [picked, setPicked] = useState<string | null>(chosen?.date ?? null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [partFilter, setPartFilter] = useState<string | null>(prefer.part);
  const [waiting, setWaiting] = useState(false);
  const [joined, setJoined] = useState(false);

  if (now === null) return <div className="min-h-96" />;

  const today = dateKey(new Date(now));
  const pref = state.therapist;
  const first = soonest(list, pref, state, now);

  // The first open date that honours a quick-find day, otherwise the soonest.
  let preferred: string | null = null;
  if (prefer.day !== null) {
    for (let i = 0; i < 21 && !preferred; i++) {
      const d = addDays(today, i);
      if (parseDate(d).getDay() === prefer.day && findSlots(d, list, pref, state, now).length) preferred = d;
    }
  }
  const date = picked ?? preferred ?? first?.date ?? today;

  const base = parseDate(today);
  const month = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const lead = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const last = addDays(today, HORIZON_DAYS);
  const lastDate = parseDate(last);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= lastDate;

  const slots = tidy(findSlots(date, list, pref, state, now));
  const shown = partFilter ? slots.filter((s) => partOf(s.start) === partFilter) : slots;

  const who = (slot: Slot) => [...new Set(slot.legs.map((l) => therapistById.get(l.therapistId)?.name))].join(" and ");

  return (
    <div>
      {first ? (
        <button
          type="button"
          onClick={() => {
            setPicked(first.date);
            setPartFilter(null);
          }}
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-panel px-4 py-2 font-medium text-accent hover:bg-plum hover:text-porcelain"
        >
          <span aria-hidden className="size-2 rounded-full bg-current" />
          Soonest: {shortDate(first.date)}, {clock(first.slot.start)}
        </button>
      ) : (
        <p className="mb-6">We can&rsquo;t fit that combination in the next eight weeks. Try removing a treatment, or call the salon.</p>
      )}

      <div className="grid gap-8 xl:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-accent" aria-live="polite">
              {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-1">
              <button type="button" disabled={monthOffset === 0} onClick={() => setMonthOffset(monthOffset - 1)} className="btn btn-line px-4! text-sm" aria-label="Previous month">Previous</button>
              <button type="button" disabled={!canNext} onClick={() => setMonthOffset(monthOffset + 1)} className="btn btn-line px-4! text-sm" aria-label="Next month">Next</button>
            </div>
          </div>
          <div role="group" aria-label="Choose a date" className="mt-3 grid grid-cols-7 gap-1 text-center">
            {WEEK.map((w) => (
              <div key={w} aria-hidden className="py-1 text-sm font-medium text-muted">{w}</div>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const key = dateKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
              const inRange = key >= today && key <= last;
              const closed = !openingFor(key);
              const count = inRange && !closed ? findSlots(key, list, pref, state, now).length : 0;
              const selected = key === date;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!count}
                  aria-pressed={selected}
                  aria-label={`${longDate(key)}, ${count ? "times available" : closed ? "closed" : "no times"}`}
                  onClick={() => {
                    setPicked(key);
                    setWaiting(false);
                  }}
                  className={`relative flex aspect-square min-h-11 w-full flex-col items-center justify-center rounded-full font-medium tabular-nums transition-colors disabled:cursor-not-allowed disabled:text-muted/60 ${selected ? "bg-plum text-porcelain" : count ? "hover:bg-panel" : ""}`}
                >
                  {i + 1}
                  {count > 0 && <span aria-hidden className={`absolute bottom-1.5 size-1.5 rounded-full ${selected ? "bg-champagne" : "bg-accent"}`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-accent" aria-live="polite">{longDate(date)}</h2>
          <div className="mt-3">
            <Pills
              group="book-part"
              small
              label="Time of day"
              value={partFilter ?? "all"}
              onChange={(id) => setPartFilter(id === "all" ? null : id)}
              options={[
                { id: "all", label: "Any time" },
                ...parts.map((p) => ({ id: p, label: p[0].toUpperCase() + p.slice(1) })),
              ]}
            />
          </div>
          <Swap id={`${date}-${partFilter ?? "all"}`}>
          {shown.length ? (
            <ul className="mt-4 grid max-h-96 grid-cols-2 gap-2 overflow-y-auto p-1 sm:grid-cols-3">
              {shown.map((s) => {
                const on = chosen?.date === date && chosen.slot.start === s.start;
                return (
                  <li key={s.start}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => onChoose({ date, slot: s, heldUntil: Date.now() + HOLD_MS })}
                      className={`min-h-14 w-full rounded-2xl border-[1.5px] px-2 py-1.5 text-center transition-colors ${on ? "border-accent bg-plum text-porcelain" : "border-line hover:bg-panel"}`}
                    >
                      <span className="block font-semibold tabular-nums">{clock(s.start)}</span>
                      <span className={`block text-xs ${on ? "text-porcelain/90" : "text-muted"}`}>{who(s)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-muted">No {partFilter ?? ""} times on this day. Try another part of the day or a different date.</p>
          )}
          </Swap>
          <button type="button" onClick={() => setWaiting(!waiting)} aria-expanded={waiting} className="mt-4 min-h-8 font-medium text-accent underline underline-offset-4">
            Can&rsquo;t see a time that works? Join the waitlist
          </button>
          {waiting && !joined && (
            <form
              className="mt-3 grid gap-3 rounded-2xl bg-panel p-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                actions.addWait({
                  id: `w${Date.now()}`,
                  date,
                  part: partFilter ?? "any time",
                  name: String(f.get("name")),
                  phone: String(f.get("phone")),
                  serviceIds: list.map((s) => s.id).filter((id) => serviceById.has(id)),
                });
                setJoined(true);
              }}
            >
              <div>
                <label htmlFor="w-name" className="mb-1 block text-sm font-semibold">Your name</label>
                <input id="w-name" name="name" required autoComplete="name" className="field" />
              </div>
              <div>
                <label htmlFor="w-phone" className="mb-1 block text-sm font-semibold">Mobile</label>
                <input id="w-phone" name="phone" type="tel" required autoComplete="tel" className="field" />
              </div>
              <button type="submit" className="btn btn-plum sm:col-span-2">Add me for {shortDate(date)}</button>
            </form>
          )}
          {joined && (
            <p role="status" className="mt-3 rounded-2xl bg-panel p-4">
              You&rsquo;re on the preview waitlist for {shortDate(date)}. In the live system, the salon would message you if a space opens up.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" disabled={!chosen} onClick={onNext} className="btn btn-plum">
          Continue
        </button>
        {!chosen && <p className="text-sm text-muted">Choose a time to continue.</p>}
      </div>
    </div>
  );
}
