"use client";

import { useEffect, useRef, useState } from "react";
import { clock, longDate, type Appointment } from "@/lib/engine";
import { gateInfo, type Service } from "@/lib/menu";
import { therapistById } from "@/lib/people";
import { actions } from "@/lib/store";
import { business } from "@/lib/site";
import type { Chosen } from "./flow";

type Errors = Record<string, string>;

export function DetailsStep({
  list,
  chosen,
  onConfirmed,
  onExpired,
}: {
  list: Service[];
  chosen: Chosen;
  onConfirmed: (a: Appointment) => void;
  onExpired: () => void;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [left, setLeft] = useState(() => chosen.heldUntil - Date.now());
  const [deadline, setDeadline] = useState(chosen.heldUntil);
  const summary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const remaining = deadline - Date.now();
      setLeft(remaining);
      if (remaining <= 0) onExpired();
    }, 1000);
    return () => window.clearInterval(id);
  }, [deadline, onExpired]);

  const gates = [...new Set(list.flatMap((s) => (s.gate ? [s.gate] : [])))].filter(
    (g) => !list.some((s) => s.id === gateInfo[g].consultId),
  );
  const needsPatch = list.some((s) => s.patch);
  const mins = Math.max(0, Math.floor(left / 60000));
  const secs = Math.max(0, Math.floor((left % 60000) / 1000));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Errors = {};
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    if (!name) next.name = "Enter your name so we know who to expect.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Enter a phone number, for example 07700 900123.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter an email address, for example name@example.co.uk.";
    if (needsPatch && !f.get("patch")) next.patch = "Let us know whether you've had a patch test with us.";
    for (const g of gates) if (!f.get(`gate-${g}`)) next[`gate-${g}`] = `Confirm you've had your ${gateInfo[g].label} consultation, or book the free consultation first.`;
    if (!f.get("policy")) next.policy = "Tick to agree to the cancellation policy.";
    setErrors(next);
    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    const flags: string[] = [];
    if (f.get("patch") === "no") flags.push("Patch test needed");
    const id = `a${Date.now()}`;
    onConfirmed({
      id,
      ref: `BS-${String(Date.now()).slice(-6)}`,
      date: chosen.date,
      legs: chosen.slot.legs,
      client: { name, phone, email, notes: String(f.get("notes") ?? "") },
      pence: list.reduce((a, s) => a + s.pence, 0),
      status: "confirmed",
      flags,
    });
  };

  const err = (key: string) =>
    errors[key] ? (
      <p id={`${key}-err`} className="mt-1 text-sm font-medium text-clay">
        <span aria-hidden>! </span>
        {errors[key]}
      </p>
    ) : null;
  const aria = (key: string) => ({
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${key}-err` : undefined,
  });
  const therapistNames = [...new Set(chosen.slot.legs.map((l) => therapistById.get(l.therapistId)?.name))].join(" and ");

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-panel p-4">
        <p>
          <strong>{longDate(chosen.date)} at {clock(chosen.slot.start)}</strong> with {therapistNames}.
          <span className="block text-sm text-muted tabular-nums" role="timer">
            Held for you for {mins}:{String(secs).padStart(2, "0")}
          </span>
        </p>
        <button type="button" className="btn btn-line text-sm" onClick={() => setDeadline(Date.now() + 5 * 60 * 1000)}>
          I need more time
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-2xl border-2 border-clay p-4">
          <p className="font-semibold text-clay">Please check {Object.keys(errors).length === 1 ? "this" : "these"}:</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.values(errors).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block font-semibold">Full name</label>
        <input id="name" name="name" autoComplete="name" className="field" {...aria("name")} />
        {err("name")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1 block font-semibold">Mobile</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className="field" {...aria("email")} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block font-semibold">Anything we should know? <span className="font-normal text-muted">(optional)</span></label>
        <textarea id="notes" name="notes" rows={3} className="field" />
      </div>

      {gates.map((g) => (
        <div key={g} className="rounded-2xl bg-panel p-4">
          <p className="font-semibold">A consultation comes first</p>
          <p className="mt-1 text-sm">Every {gateInfo[g].label} treatment starts with a free consultation.</p>
          <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3">
            <input type="checkbox" name={`gate-${g}`} className="mt-1 size-5 accent-plum" {...aria(`gate-${g}`)} />
            <span>I&rsquo;ve already had my consultation at The Beauty Spot</span>
          </label>
          {err(`gate-${g}`)}
          <button
            type="button"
            className="btn btn-line mt-2 text-sm"
            onClick={() => {
              const target = list.find((s) => s.gate === g);
              if (target) actions.swap(target.id, gateInfo[g].consultId);
              onExpired();
            }}
          >
            Book the free consultation instead
          </button>
        </div>
      ))}

      {needsPatch && (
        <fieldset className="rounded-2xl bg-panel p-4">
          <legend className="float-left w-full font-semibold">Have you had a patch test with us?</legend>
          <p className="clear-both pt-1 text-sm">Some tints and lash treatments need one beforehand. If you haven&rsquo;t, we&rsquo;ll arrange it before your appointment.</p>
          <div className="mt-2 flex gap-6">
            <label className="flex min-h-11 cursor-pointer items-center gap-2">
              <input type="radio" name="patch" value="yes" className="size-5 accent-plum" /> Yes
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2">
              <input type="radio" name="patch" value="no" className="size-5 accent-plum" /> Not yet
            </label>
          </div>
          {err("patch")}
        </fieldset>
      )}

      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input type="checkbox" name="policy" className="mt-1 size-5 shrink-0 accent-plum" {...aria("policy")} />
          <span>I understand that cancelling with less than 24 hours&rsquo; notice results in a 50% cancellation fee.</span>
        </label>
        {err("policy")}
      </div>

      <div className="rounded-2xl border-[1.5px] border-line p-4">
        <p className="font-semibold">This is a preview of the new booking system</p>
        <p className="mt-1 text-sm text-muted">
          Confirming won&rsquo;t reserve a real appointment or contact the salon, and your details stay in this browser. To book today, call{" "}
          <a href={business.phoneHref} className="font-medium underline underline-offset-3">{business.phone}</a>.
        </p>
      </div>

      <button type="submit" className="btn btn-plum">Confirm preview appointment</button>
    </form>
  );
}
