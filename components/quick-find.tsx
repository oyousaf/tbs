"use client";

import { useId, useState } from "react";
import { duration, gbp } from "@/lib/menu";
import { quickFind, type QuickResult } from "@/lib/quickfind";
import { dayNames } from "@/lib/site";
import { actions, useStore } from "@/lib/store";

const examples = ["Gel nails and brows, Thursday after work", "Sore shoulders", "A full pamper day"];

export function QuickFind() {
  const id = useId();
  const [text, setText] = useState("");
  const [result, setResult] = useState<QuickResult | null>(null);
  const { tray } = useStore();

  const run = (value: string) => {
    setText(value);
    const r = quickFind(value);
    setResult(r);
    if (r.services.length) actions.setPrefer({ day: r.day, part: r.part });
  };

  const when = result
    ? [result.day !== null ? dayNames[result.day] : null, result.part].filter(Boolean).join(" ")
    : "";

  return (
    <div className="rounded-3xl bg-panel p-5 sm:p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(text);
        }}
      >
        <label htmlFor={id} className="font-display text-2xl text-accent">
          Not sure where to start?
        </label>
        <p className="mt-1 text-muted">Tell us what you&rsquo;re after, in your own words.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input id={id} value={text} onChange={(e) => setText(e.target.value)} className="field" autoComplete="off" />
          <button type="submit" className="btn btn-plum shrink-0">
            Suggest treatments
          </button>
        </div>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="text-muted">Try:</span>
        {examples.map((e) => (
          <button key={e} type="button" onClick={() => run(e)} className="min-h-7 text-accent underline underline-offset-3 hover:opacity-75">
            {e}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {result && result.services.length > 0 && (
          <div className="mt-5 border-t border-accent/20 pt-4">
            <p className="font-semibold">
              Here&rsquo;s what might suit{when ? `, and we'll look at ${when} first` : ""}:
            </p>
            <ul className="mt-2 space-y-2">
              {result.services.map((s) => {
                const added = tray.includes(s.id);
                return (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {s.name}{" "}
                      <span className="text-muted">
                        {!s.estimated && `${duration(s.minutes)}, `}
                        {gbp(s.pence)}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-pressed={added}
                      aria-label={`${added ? "Remove" : "Add"} ${s.name}`}
                      onClick={() => actions.toggle(s.id)}
                      className={`btn min-w-22 px-4! text-sm ${added ? "btn-plum" : "btn-line"}`}
                    >
                      {added ? "Added" : "Add"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {result && result.services.length === 0 && (
          <p className="mt-4 border-t border-accent/20 pt-4">
            We couldn&rsquo;t match that to a treatment. Try the menu below, or call the salon and a therapist will happily advise.
          </p>
        )}
      </div>
    </div>
  );
}
