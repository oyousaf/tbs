"use client";

import { useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";

const KEY = "tbs-theme";
const order: Theme[] = ["system", "light", "dark"];
const names: Record<Theme, string> = { system: "Device", light: "Light", dark: "Dark" };
const listeners = new Set<() => void>();

const read = (): Theme => {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* Storage can be refused: the device setting still applies. */
  }
  return "system";
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function apply(theme: Theme) {
  try {
    if (theme === "system") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, theme);
  } catch {
    /* The choice still applies for this page view. */
  }
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  listeners.forEach((l) => l());
}

function Icon({ theme }: { theme: Theme }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (theme === "light")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
      </svg>
    );
  if (theme === "dark")
    return (
      <svg {...common}>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M8.5 20h7M12 16.5V20" />
    </svg>
  );
}

/** Cycles device, light, dark. Device is the default, so it follows the system until someone chooses. */
export function ThemeToggle({ labelled, className = "" }: { labelled?: boolean; className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);
  const next = order[(order.indexOf(theme) + 1) % order.length];
  const label = `Theme: ${names[theme]}. Switch to ${names[next]}.`;

  return (
    <button
      type="button"
      onClick={() => {
        const run = () => apply(next);
        if (document.startViewTransition) document.startViewTransition(run);
        else run();
      }}
      aria-label={labelled ? undefined : label}
      title={label}
      className={`btn ${labelled ? "" : "size-11 p-0!"} ${className}`}
    >
      <Icon theme={theme} />
      {labelled && (
        <span>
          Theme: {names[theme]}
          <span className="sr-only">. Switch to {names[next]}.</span>
        </span>
      )}
    </button>
  );
}
