"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

type Option = { id: string; label: ReactNode };

/** Pill buttons whose highlight glides to the selection. `kind` sets the semantics. */
export function Pills({
  group,
  options,
  value,
  onChange,
  kind = "toggle",
  label,
  small,
}: {
  group: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  kind?: "tab" | "toggle";
  label: string;
  small?: boolean;
}) {
  return (
    <div role={kind === "tab" ? "tablist" : "group"} aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role={kind === "tab" ? "tab" : undefined}
            aria-selected={kind === "tab" ? on : undefined}
            aria-pressed={kind === "toggle" ? on : undefined}
            onClick={() => onChange(o.id)}
            className={`btn relative border-[1.5px] border-accent transition-colors duration-200 ${small ? "px-3.5! py-1! text-sm" : "px-4!"} ${on ? "text-porcelain" : "text-accent hover:bg-panel"}`}
          >
            {on && (
              <motion.span
                layoutId={`pill-${group}`}
                aria-hidden
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute -inset-[1.5px] rounded-full bg-plum"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Crossfades and gently lifts content whenever `id` changes. */
export function Swap({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
