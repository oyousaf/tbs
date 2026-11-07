"use client";

import Image from "next/image";
import { canDo } from "@/lib/engine";
import type { Service } from "@/lib/menu";
import { therapists } from "@/lib/people";
import { actions } from "@/lib/store";

export function TherapistStep({
  list,
  selected,
  onNext,
}: {
  list: Service[];
  selected: string;
  onNext: () => void;
}) {
  const options = therapists.map((t) => {
    const missing = list.filter((s) => !canDo(t.id, s));
    return { t, missing };
  });
  const current = options.find((o) => o.t.id === selected && !o.missing.length) ? selected : "any";

  return (
    <fieldset>
      <legend className="sr-only">Choose a therapist</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={`flex min-h-28 cursor-pointer items-center gap-4 rounded-3xl border-[1.5px] p-4 has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${current === "any" ? "border-accent bg-panel" : "border-line hover:bg-panel/50"}`}>
          <input type="radio" name="therapist" className="sr-only" checked={current === "any"} onChange={() => actions.setTherapist("any")} />
          <span aria-hidden className="size-16 shrink-0 rounded-full bg-accent" />
          <span>
            <span className="block font-display text-2xl text-accent">Whoever&rsquo;s free</span>
            <span className="text-sm text-muted">The most times to choose from</span>
          </span>
        </label>
        {options.map(({ t, missing }) => (
          <label
            key={t.id}
            className={`flex min-h-28 items-center gap-4 rounded-3xl border-[1.5px] p-4 has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${missing.length ? "cursor-not-allowed border-line/50 opacity-65" : "cursor-pointer"} ${current === t.id ? "border-accent bg-panel" : missing.length ? "" : "border-line hover:bg-panel/50"}`}
          >
            <input type="radio" name="therapist" className="sr-only" disabled={missing.length > 0} checked={current === t.id} onChange={() => actions.setTherapist(t.id)} />
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-panel">
              <Image src={t.image} alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-2xl text-accent">{t.name}</span>
              <span className="text-sm text-muted">
                {missing.length ? `Doesn't offer ${missing[0].name.toLowerCase()}` : t.role}
              </span>
            </span>
          </label>
        ))}
      </div>
      <button type="button" onClick={onNext} className="btn btn-plum mt-7">
        See available times
      </button>
    </fieldset>
  );
}
