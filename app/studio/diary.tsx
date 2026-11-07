"use client";

import { useEffect, useRef, useState } from "react";
import { canPlace, clock, openingFor, worksOn, type DiaryItem } from "@/lib/engine";
import { gbp } from "@/lib/menu";
import { therapistById, therapists } from "@/lib/people";
import { actions, useStore } from "@/lib/store";

const PX_PER_MIN = 1.5;
const SNAP = 15;

export function Diary({ date, items }: { date: string; items: DiaryItem[] }) {
  const state = useStore();
  const open = openingFor(date);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number; ok: boolean } | null>(null);
  const [notice, setNotice] = useState("");
  const [blocking, setBlocking] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  if (!open) return <p className="rounded-3xl bg-page p-6">The salon is closed on this day.</p>;

  const columns = therapists.filter((t) => worksOn(t.id, date));
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const height = (open[1] - open[0]) * PX_PER_MIN;
  const hoursList: number[] = [];
  for (let h = Math.ceil(open[0] / 60); h * 60 <= open[1]; h++) hoursList.push(h * 60);

  const columnWidth = () => {
    const box = grid.current;
    return box ? box.clientWidth / columns.length : 1;
  };

  const target = (item: DiaryItem, dx: number, dy: number) => {
    const delta = Math.round((dy / PX_PER_MIN) / SNAP) * SNAP;
    const from = columns.findIndex((c) => c.id === item.therapistId);
    const to = Math.min(columns.length - 1, Math.max(0, from + Math.round(dx / columnWidth())));
    return { therapistId: columns[to].id, start: item.start + delta };
  };

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, item: DiaryItem) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    moved.current = false;
    const el = e.currentTarget;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved.current = true;
      if (!moved.current) return;
      const t = target(item, dx, dy);
      setDrag({ id: item.id, dx, dy, ok: canPlace(item, t.therapistId, t.start, state) });
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      setDrag(null);
      if (!moved.current) return;
      const t = target(item, ev.clientX - startX, ev.clientY - startY);
      if (canPlace(item, t.therapistId, t.start, state)) {
        actions.move(item.id, t.therapistId, t.start);
        setNotice(`${item.title} moved to ${clock(t.start)} with ${therapistById.get(t.therapistId)?.name}.`);
      } else {
        setNotice("That time clashes, so the appointment stayed where it was.");
      }
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Drag to move an appointment, or select it to move it with menus.</p>
        <button type="button" className="btn btn-line text-sm" aria-expanded={blocking} onClick={() => setBlocking(!blocking)}>Block out time</button>
      </div>
      <p role="status" className="mb-2 min-h-6 font-medium text-accent">{notice}</p>
      {blocking && <BlockForm date={date} open={open} columns={columns.map((c) => c.id)} onDone={() => setBlocking(false)} />}

      <div className="overflow-x-auto rounded-3xl bg-page p-3 sm:p-4">
        <div className="min-w-160">
          <div className="grid pl-14" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            {columns.map((c) => (
              <h2 key={c.id} className="pb-2 pl-1 font-display text-xl text-accent">{c.name}</h2>
            ))}
          </div>
          <div className="relative flex">
            <div aria-hidden className="relative w-14 shrink-0" style={{ height }}>
              {hoursList.map((m) => (
                <span key={m} className="absolute -translate-y-1/2 text-xs text-muted tabular-nums" style={{ top: (m - open[0]) * PX_PER_MIN }}>
                  {clock(m)}
                </span>
              ))}
            </div>
            <div ref={grid} className="relative grid grow" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`, height }}>
              {hoursList.map((m) => (
                <span key={m} aria-hidden className="absolute inset-x-0 border-t border-accent/12" style={{ top: (m - open[0]) * PX_PER_MIN }} />
              ))}
              {columns.map((c) => (
                <ul key={c.id} aria-label={`${c.name}'s appointments`} className="relative border-l border-accent/12">
                  {items.filter((i) => i.therapistId === c.id).map((i) => {
                    const d = drag?.id === i.id ? drag : null;
                    const tone =
                      i.source === "block"
                        ? "bg-muted/15 text-ink"
                        : i.source === "online"
                          ? "bg-champagne text-aubergine"
                          : i.status === "noshow"
                            ? "bg-clay/15 text-ink line-through"
                            : i.status === "arrived"
                              ? "bg-sage-solid text-porcelain"
                              : "bg-plum text-porcelain";
                    const minutes = i.end - i.start;
                    return (
                      <li key={i.id} className="absolute inset-x-1" style={{ top: (i.start - open[0]) * PX_PER_MIN, height: Math.max(minutes * PX_PER_MIN - 2, 20) }}>
                        <button
                          type="button"
                          onPointerDown={(e) => onDown(e, i)}
                          onClick={() => {
                            if (!moved.current) setSelectedId(i.id);
                          }}
                          style={d ? { transform: `translate(${d.dx}px, ${d.dy}px)`, zIndex: 20 } : undefined}
                          className={`block size-full cursor-grab touch-none overflow-hidden rounded-lg px-2 py-0.5 text-left text-xs leading-tight shadow-xs active:cursor-grabbing ${tone} ${d && !d.ok ? "opacity-50 outline-2 outline-clay" : ""}`}
                        >
                          <span className="font-semibold">{clock(i.start)} {i.client || i.title}</span>
                          {i.client && (
                            <span className={minutes >= 30 ? "block truncate" : "sr-only"}>
                              {minutes < 30 ? ", " : ""}
                              {i.title}
                            </span>
                          )}
                          <span className="sr-only">, until {clock(i.end)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {[["bg-plum", "Booked"], ["bg-champagne", "Booked online by you"], ["bg-sage-solid", "Arrived"], ["bg-muted/30", "Blocked out"]].map(([c, l]) => (
          <li key={l} className="flex items-center gap-2"><span aria-hidden className={`size-3 rounded-full ${c}`} />{l}</li>
        ))}
      </ul>
      {selected && <ItemDialog key={selected.id} item={selected} columns={columns.map((c) => c.id)} open={open} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function timeOptions(open: [number, number]) {
  const list: number[] = [];
  for (let m = open[0]; m < open[1]; m += SNAP) list.push(m);
  return list;
}

function ItemDialog({ item, columns, open, onClose }: { item: DiaryItem; columns: string[]; open: [number, number]; onClose: () => void }) {
  const state = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  const [therapistId, setTherapistId] = useState(item.therapistId);
  const [start, setStart] = useState(item.start);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog ref={ref} onClose={onClose} aria-label={item.title} className="m-auto w-full max-w-md rounded-3xl bg-page p-6 text-ink">
      <p className="text-sm text-muted">{clock(item.start)} to {clock(item.end)} · {therapistById.get(item.therapistId)?.name}</p>
      <h2 className="mt-1 font-display text-3xl text-accent">{item.client || item.title}</h2>
      {item.client && <p className="mt-1">{item.title}{item.pence ? `, ${gbp(item.pence)}` : ""}</p>}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="m-who" className="mb-1 block text-sm font-semibold">Therapist</label>
          <select id="m-who" value={therapistId} onChange={(e) => setTherapistId(e.target.value)} className="field">
            {columns.map((c) => <option key={c} value={c}>{therapistById.get(c)?.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="m-time" className="mb-1 block text-sm font-semibold">Start time</label>
          <select id="m-time" value={start} onChange={(e) => setStart(Number(e.target.value))} className="field">
            {timeOptions(open).map((m) => <option key={m} value={m}>{clock(m)}</option>)}
          </select>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-plum mt-3"
        onClick={() => {
          if (canPlace(item, therapistId, start, state)) {
            actions.move(item.id, therapistId, start);
            ref.current?.close();
          } else setMsg("That time clashes with another appointment or falls outside opening hours.");
        }}
      >
        Move appointment
      </button>
      <p role="status" className="mt-2 min-h-5 text-sm font-medium text-clay">{msg}</p>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-accent/15 pt-4">
        {item.source === "block" ? (
          <button type="button" className="btn btn-line text-sm" onClick={() => { actions.removeBlock(item.id); ref.current?.close(); }}>Remove block</button>
        ) : (
          <>
            <button type="button" className="btn btn-line text-sm" onClick={() => { actions.setStatus(item.id, "arrived"); ref.current?.close(); }}>Mark arrived</button>
            <button type="button" className="btn btn-line text-sm" onClick={() => { actions.setStatus(item.id, "noshow"); ref.current?.close(); }}>Mark no-show</button>
          </>
        )}
        <button type="button" className="btn text-sm underline" onClick={() => ref.current?.close()}>Close</button>
      </div>
    </dialog>
  );
}

function BlockForm({ date, open, columns, onDone }: { date: string; open: [number, number]; columns: string[]; onDone: () => void }) {
  return (
    <form
      className="mb-4 grid items-end gap-3 rounded-3xl bg-page p-4 sm:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const start = Number(f.get("start"));
        actions.addBlock({
          id: `b${Date.now()}`,
          date,
          therapistId: String(f.get("who")),
          start,
          end: Math.min(open[1], start + Number(f.get("len"))),
          reason: String(f.get("reason")) || "Blocked out",
        });
        onDone();
      }}
    >
      <div>
        <label htmlFor="b-who" className="mb-1 block text-sm font-semibold">Therapist</label>
        <select id="b-who" name="who" className="field">
          {columns.map((c) => <option key={c} value={c}>{therapistById.get(c)?.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="b-start" className="mb-1 block text-sm font-semibold">From</label>
        <select id="b-start" name="start" className="field">
          {timeOptions(open).map((m) => <option key={m} value={m}>{clock(m)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="b-len" className="mb-1 block text-sm font-semibold">For</label>
        <select id="b-len" name="len" defaultValue={60} className="field">
          {[15, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} min</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="b-why" className="mb-1 block text-sm font-semibold">Reason</label>
        <input id="b-why" name="reason" className="field" defaultValue="Lunch" />
      </div>
      <button type="submit" className="btn btn-plum">Add block</button>
    </form>
  );
}
