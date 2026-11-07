"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RegionMenu } from "@/components/menu-list";
import { QuickFind } from "@/components/quick-find";
import { Pills, Swap } from "@/components/tabs";
import type { Appointment, Slot } from "@/lib/engine";
import { clock, longDate, shortDate } from "@/lib/engine";
import { duration, gbp, regions, servicesFor, type RegionId } from "@/lib/menu";
import { actions, useStore } from "@/lib/store";
import { DetailsStep } from "./details-step";
import { DoneStep } from "./done-step";
import { TherapistStep } from "./therapist-step";
import { TimeStep } from "./time-step";

const steps = [
  { id: "treatments", label: "Treatments" },
  { id: "therapist", label: "Therapist" },
  { id: "time", label: "Time" },
  { id: "details", label: "Your details" },
] as const;

export type Chosen = { date: string; slot: Slot; heldUntil: number };

const subscribeToStep = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener("book-step", listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("book-step", listener);
  };
};

const readStep = () => new URLSearchParams(window.location.search).get("step") ?? "treatments";

export function BookingFlow() {
  // Not useSearchParams: it would suspend, and the first step could no longer ship in the static HTML.
  const requested = useSyncExternalStore(subscribeToStep, readStep, () => "treatments");
  const state = useStore();
  const list = servicesFor(state.tray);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [done, setDone] = useState<Appointment | null>(null);
  const [region, setRegion] = useState<RegionId>("face");
  const heading = useRef<HTMLHeadingElement>(null);

  let step = requested;
  if (step === "done" && !done) step = "treatments";
  if (step !== "done" && !list.length) step = "treatments";
  if (step === "details" && !chosen) step = list.length ? "time" : "treatments";

  const go = (next: string) => {
    window.history.pushState(null, "", `/book?step=${next}`);
    window.dispatchEvent(new Event("book-step"));
    window.scrollTo({ top: 0 });
  };

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const index = steps.findIndex((s) => s.id === step);
  const minutes = list.reduce((a, s) => a + s.minutes, 0);
  const pence = list.reduce((a, s) => a + s.pence, 0);

  if (step === "done" && done) {
    return <DoneStep appointment={done} headingRef={heading} />;
  }

  const titles: Record<string, string> = {
    treatments: "What are we doing?",
    therapist: "Who would you like to see?",
    time: "When suits you?",
    details: "Nearly there.",
  };

  return (
    <div className="wrap-page py-8 sm:py-12">
      <nav aria-label="Booking progress">
        <ol className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {steps.map((s, i) => (
            <li key={s.id} aria-current={i === index ? "step" : undefined} className={`flex items-center gap-2 ${i === index ? "font-semibold text-accent" : i < index ? "text-accent" : "text-muted"}`}>
              <span aria-hidden className={`size-2.5 rounded-full border-[1.5px] border-accent ${i <= index ? "bg-accent" : ""}`} />
              {i < index ? (
                <button type="button" onClick={() => go(s.id)} className="min-h-6 underline underline-offset-3">
                  {s.label}
                </button>
              ) : (
                s.label
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <h1 ref={heading} tabIndex={-1} className="font-display text-5xl leading-[1.02] text-accent outline-hidden sm:text-6xl">
            {titles[step]}
          </h1>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-7"
            >
              {step === "treatments" && (
                <div className="space-y-8">
                  <QuickFind />
                  <div>
                    <h2 className="mb-3 font-display text-3xl text-accent">Or browse the menu</h2>
                    <Pills
                      group="book-region"
                      kind="tab"
                      label="Browse by area"
                      value={region}
                      onChange={(id) => setRegion(id as RegionId)}
                      options={[...regions, { id: "packages" as RegionId, name: "All of it" }].map((r) => ({ id: r.id, label: r.name }))}
                    />
                    <div role="tabpanel" aria-label={region} className="mt-6">
                      <Swap id={region}>
                        <RegionMenu region={region} />
                      </Swap>
                    </div>
                  </div>
                </div>
              )}
              {step === "therapist" && (
                <TherapistStep list={list} selected={state.therapist} onNext={() => go("time")} />
              )}
              {step === "time" && (
                <TimeStep
                  list={list}
                  prefer={state.prefer}
                  chosen={chosen}
                  onChoose={setChosen}
                  onNext={() => go("details")}
                />
              )}
              {step === "details" && chosen && (
                <DetailsStep
                  list={list}
                  chosen={chosen}
                  onExpired={() => {
                    setChosen(null);
                    go("time");
                  }}
                  onConfirmed={(a) => {
                    setDone(a);
                    actions.addAppointment(a);
                    setChosen(null);
                    go("done");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside aria-label="Your appointment" className="lg:col-span-4">
          <div className="on-dark rounded-3xl bg-plum p-6 text-porcelain lg:sticky lg:top-24">
            <h2 className="font-display text-2xl">Your appointment</h2>
            {list.length === 0 ? (
              <p className="mt-3 text-porcelain/90">Nothing yet. Add a treatment and it&rsquo;ll appear here.</p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-porcelain/20">
                  {list.map((s) => (
                    <li key={s.id} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="font-medium">{s.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            actions.toggle(s.id);
                            setChosen(null);
                          }}
                          aria-label={`Remove ${s.name}`}
                          className="min-h-6 text-sm text-porcelain/85 underline underline-offset-3 hover:text-champagne"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="shrink-0 tabular-nums">{gbp(s.pence)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-3 space-y-1 border-t border-porcelain/40 pt-3">
                  <div className="flex justify-between"><dt>About</dt><dd>{duration(minutes)}</dd></div>
                  {chosen && (
                    <div className="flex justify-between gap-3">
                      <dt>When</dt>
                      <dd className="text-right">{shortDate(chosen.date)}, {clock(chosen.slot.start)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd className="tabular-nums">{gbp(pence)}</dd></div>
                  <div className="flex justify-between text-champagne"><dt>Treat Points earned</dt><dd className="tabular-nums">{Math.floor(pence / 100)}</dd></div>
                </dl>
                {step === "treatments" && (
                  <button type="button" onClick={() => go("therapist")} className="btn btn-champagne mt-5 w-full">
                    Continue
                  </button>
                )}
                {chosen && <p className="sr-only">{longDate(chosen.date)}</p>}
              </>
            )}
            <p className="mt-4 text-sm text-porcelain/85">Pay in the salon. No card needed to book.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
