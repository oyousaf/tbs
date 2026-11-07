"use client";

import { useSyncExternalStore } from "react";
import type { Appointment, Block, DiaryState, DiaryStatus, WaitEntry } from "./engine";

export type State = DiaryState & {
  tray: string[];
  therapist: string;
  waitlist: WaitEntry[];
  prefer: { day: number | null; part: string | null };
};

const KEY = "tbs-preview-v1";
const initial: State = {
  tray: [],
  therapist: "any",
  appointments: [],
  blocks: [],
  moved: {},
  statuses: {},
  waitlist: [],
  prefer: { day: null, part: null },
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    state = initial;
  }
}

function set(patch: Partial<State>) {
  load();
  state = { ...state, ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* Private windows can refuse storage; the session still works in memory. */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const snapshot = () => {
  load();
  return state;
};

export const useStore = () => useSyncExternalStore(subscribe, snapshot, () => initial);

const noopSub = () => () => {};
/** False during prerender and hydration, true afterwards: gate browser-only UI with it. */
export const useMounted = () => useSyncExternalStore(noopSub, () => true, () => false);

const MIN = 60000;
const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 15000);
  return () => window.clearInterval(id);
};
/** Current time to the minute, or null until the browser has taken over. */
export const useNow = () =>
  useSyncExternalStore(subscribeMinute, () => Math.floor(Date.now() / MIN) * MIN, () => null);

export const actions = {
  toggle(id: string) {
    load();
    set({ tray: state.tray.includes(id) ? state.tray.filter((x) => x !== id) : [...state.tray, id] });
  },
  add(id: string) {
    load();
    if (!state.tray.includes(id)) set({ tray: [...state.tray, id] });
  },
  setTray(tray: string[]) {
    set({ tray });
  },
  swap(from: string, to: string) {
    load();
    set({ tray: state.tray.map((x) => (x === from ? to : x)) });
  },
  setTherapist(therapist: string) {
    set({ therapist });
  },
  setPrefer(prefer: State["prefer"]) {
    set({ prefer });
  },
  addAppointment(a: Appointment) {
    load();
    set({
      appointments: [a, ...state.appointments],
      tray: [],
      therapist: "any",
      prefer: initial.prefer,
    });
  },
  updateAppointment(id: string, patch: Partial<Appointment>) {
    load();
    set({ appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  },
  addWait(w: WaitEntry) {
    load();
    set({ waitlist: [w, ...state.waitlist] });
  },
  approveWait(id: string) {
    load();
    set({ waitlist: state.waitlist.map((w) => (w.id === id ? { ...w, approved: true } : w)) });
  },
  removeWait(id: string) {
    load();
    set({ waitlist: state.waitlist.filter((w) => w.id !== id) });
  },
  addBlock(b: Block) {
    load();
    set({ blocks: [...state.blocks, b] });
  },
  removeBlock(id: string) {
    load();
    set({ blocks: state.blocks.filter((b) => b.id !== id) });
  },
  move(id: string, therapistId: string, start: number) {
    load();
    set({ moved: { ...state.moved, [id]: { therapistId, start } } });
  },
  setStatus(id: string, status: DiaryStatus) {
    load();
    set({ statuses: { ...state.statuses, [id]: status } });
  },
  reset() {
    const { tray, therapist, prefer } = state;
    set({ ...initial, tray, therapist, prefer });
  },
};
