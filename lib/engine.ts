import { hours } from "./site";
import { serviceById, services, type Service } from "./menu";
import { therapistById, therapists } from "./people";

export const TURNAROUND = 5;
export const CAPACITY = { room: 2, nails: 2 } as const;
export const HORIZON_DAYS = 56;

export type Leg = {
  serviceId: string;
  therapistId: string;
  start: number;
  end: number;
};

export type Client = { name: string; phone: string; email: string; notes: string };

export type Appointment = {
  id: string;
  ref: string;
  date: string;
  legs: Leg[];
  client: Client;
  pence: number;
  status: "confirmed" | "cancelled";
  flags: string[];
};

export type Block = {
  id: string;
  date: string;
  therapistId: string;
  start: number;
  end: number;
  reason: string;
};

export type WaitEntry = {
  id: string;
  date: string;
  part: string;
  name: string;
  phone: string;
  serviceIds: string[];
  approved?: boolean;
};

export type DiaryStatus = "booked" | "arrived" | "noshow";

export type DiaryState = {
  appointments: Appointment[];
  blocks: Block[];
  moved: Record<string, { therapistId: string; start: number }>;
  statuses: Record<string, DiaryStatus>;
};

export type DiaryItem = {
  id: string;
  date: string;
  therapistId: string;
  start: number;
  end: number;
  title: string;
  client: string;
  pence: number;
  resource: "room" | "nails" | null;
  source: "sample" | "online" | "block";
  status: DiaryStatus;
  appointmentId?: string;
};

export type Slot = { start: number; end: number; legs: Leg[] };

/* ---------- dates ---------- */

const pad = (n: number) => String(n).padStart(2, "0");

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDate = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key: string, n: number) => {
  const d = parseDate(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
};

export const clock = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${pad(m)}${suffix}` : `${h12}${suffix}`;
};

export const longDate = (key: string) =>
  parseDate(key).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const shortDate = (key: string) =>
  parseDate(key).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const openingFor = (key: string) => hours[parseDate(key).getDay()];

/* ---------- sample diary ---------- */

const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const sampleClients = [
  "Hannah Pryce", "Marnie Oakes", "Priya Sandhu", "Jo Whitlock", "Tess Marlow",
  "Anita Fenn", "Rosalind Keyes", "Dee Hartwell", "Sasha Bloom", "Nell Ashby",
  "Farah Lyle", "Georgie Vance", "Imogen Tate", "Lena Corbett", "Wendy Stroud",
  "Maya Ellery", "Bryony Cole", "Carys Dunmore", "Ottilie Reece", "Vic Hallam",
];

const cache = new Map<string, DiaryItem[]>();

export function sampleDiary(date: string): DiaryItem[] {
  const hit = cache.get(date);
  if (hit) return hit;
  const open = openingFor(date);
  const items: DiaryItem[] = [];
  if (open) {
    const dow = parseDate(date).getDay();
    for (const t of therapists) {
      if (!t.days.includes(dow)) continue;
      const rand = rng(hash(date + t.id));
      const options = services.filter(
        (x) => t.skills.includes(x.skill) && x.pence > 0 && x.minutes <= 105,
      );
      let at = open[0];
      let n = 0;
      while (at < open[1]) {
        if (rand() < 0.42) {
          at += [30, 45, 60, 90][Math.floor(rand() * 4)];
          continue;
        }
        const svc = options[Math.floor(rand() * options.length)];
        const minutes = Math.max(15, Math.ceil(svc.minutes / 15) * 15);
        if (at + minutes > open[1]) break;
        items.push({
          id: `s-${date}-${t.id}-${n++}`,
          date,
          therapistId: t.id,
          start: at,
          end: at + minutes,
          title: svc.name,
          client: sampleClients[Math.floor(rand() * sampleClients.length)],
          pence: svc.pence,
          resource: svc.resource,
          source: "sample",
          status: "booked",
        });
        at += minutes + (rand() < 0.5 ? 15 : 0);
      }
    }
  }
  cache.set(date, items);
  return items;
}

/* ---------- combined diary ---------- */

export function getDiary(date: string, state: DiaryState, excludeAppointment?: string): DiaryItem[] {
  const online: DiaryItem[] = state.appointments
    .filter((a) => a.date === date && a.status === "confirmed" && a.id !== excludeAppointment)
    .flatMap((a) =>
      a.legs.map((l, i): DiaryItem => {
        const svc = serviceById.get(l.serviceId);
        return {
          id: `${a.id}:${i}`,
          date,
          therapistId: l.therapistId,
          start: l.start,
          end: l.end,
          title: svc?.name ?? "Treatment",
          client: a.client.name,
          pence: svc?.pence ?? 0,
          resource: svc?.resource ?? "room",
          source: "online",
          status: "booked",
          appointmentId: a.id,
        };
      }),
    );
  const blocks: DiaryItem[] = state.blocks
    .filter((b) => b.date === date)
    .map((b) => ({
      id: b.id,
      date,
      therapistId: b.therapistId,
      start: b.start,
      end: b.end,
      title: b.reason,
      client: "",
      pence: 0,
      resource: null,
      source: "block",
      status: "booked",
    }));
  return [...sampleDiary(date), ...online, ...blocks]
    .map((item) => {
      const move = state.moved[item.id];
      const status = state.statuses[item.id] ?? item.status;
      if (!move) return { ...item, status };
      return {
        ...item,
        status,
        therapistId: move.therapistId,
        start: move.start,
        end: move.start + (item.end - item.start),
      };
    })
    .sort((a, b) => a.start - b.start);
}

const isFree = (items: DiaryItem[], therapistId: string, start: number, end: number, ignore?: string) =>
  !items.some(
    (i) =>
      i.id !== ignore &&
      i.therapistId === therapistId &&
      i.start < end + TURNAROUND &&
      i.end + TURNAROUND > start,
  );

const hasCapacity = (items: DiaryItem[], resource: "room" | "nails", start: number, end: number, ignore?: string) =>
  items.filter(
    (i) => i.id !== ignore && i.resource === resource && i.start < end && i.end > start,
  ).length < CAPACITY[resource];

export const canDo = (therapistId: string, svc: Service) =>
  therapistById.get(therapistId)?.skills.includes(svc.skill) ?? false;

export const worksOn = (therapistId: string, date: string) =>
  therapistById.get(therapistId)?.days.includes(parseDate(date).getDay()) ?? false;

/** Whether a diary item can move to this therapist and start time. */
export function canPlace(item: DiaryItem, therapistId: string, start: number, state: DiaryState) {
  const open = openingFor(item.date);
  if (!open || !worksOn(therapistId, item.date)) return false;
  const end = start + (item.end - item.start);
  if (start < open[0] || end > open[1]) return false;
  const items = getDiary(item.date, state);
  if (!isFree(items, therapistId, start, end, item.id)) return false;
  return !item.resource || hasCapacity(items, item.resource, start, end, item.id);
}

function place(
  list: Service[],
  index: number,
  at: number,
  pref: string,
  closes: number,
  date: string,
  items: DiaryItem[],
  last?: string,
): Leg[] | null {
  if (index === list.length) return [];
  const svc = list[index];
  const end = at + svc.minutes;
  if (end > closes) return null;
  if (!hasCapacity(items, svc.resource, at, end)) return null;
  const candidates =
    pref === "any"
      ? [...therapists].sort((a, b) => Number(b.id === last) - Number(a.id === last))
      : therapists.filter((t) => t.id === pref);
  for (const t of candidates) {
    if (!canDo(t.id, svc) || !worksOn(t.id, date) || !isFree(items, t.id, at, end)) continue;
    const rest = place(list, index + 1, end, pref, closes, date, items, t.id);
    if (rest) return [{ serviceId: svc.id, therapistId: t.id, start: at, end }, ...rest];
  }
  return null;
}

/** Every start time on `date` that fits the whole visit back to back. */
export function findSlots(
  date: string,
  list: Service[],
  pref: string,
  state: DiaryState,
  now: number,
  excludeAppointment?: string,
): Slot[] {
  const open = openingFor(date);
  if (!open || !list.length) return [];
  const items = getDiary(date, state, excludeAppointment);
  const minLead = new Date(now);
  const isToday = dateKey(minLead) === date;
  const earliest = isToday ? minLead.getHours() * 60 + minLead.getMinutes() + 60 : 0;
  if (parseDate(date).getTime() < parseDate(dateKey(minLead)).getTime()) return [];
  const slots: Slot[] = [];
  for (let at = open[0]; at < open[1]; at += 15) {
    if (at < earliest) continue;
    const legs = place(list, 0, at, pref, open[1], date, items);
    if (legs) slots.push({ start: at, end: legs[legs.length - 1].end, legs });
  }
  return slots;
}

export function soonest(list: Service[], pref: string, state: DiaryState, now: number, days = HORIZON_DAYS) {
  const today = dateKey(new Date(now));
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const slots = findSlots(date, list, pref, state, now);
    if (slots.length) return { date, slot: slots[0] };
  }
  return null;
}

export const partOf = (mins: number) =>
  mins < 12 * 60 ? "morning" : mins < 17 * 60 ? "afternoon" : "evening";

/** Cancellation policy: 50% of the treatment price inside 24 hours. */
export function cancellationFee(appt: Appointment, now: number) {
  const at = parseDate(appt.date);
  at.setMinutes(appt.legs[0].start);
  const within = at.getTime() - now < 24 * 60 * 60 * 1000;
  return { within, pence: within ? Math.round(appt.pence / 2) : 0 };
}

export function buildIcs(appt: Appointment) {
  const stamp = (mins: number) => {
    const d = parseDate(appt.date);
    d.setMinutes(mins);
    return `${dateKey(d).replaceAll("-", "")}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };
  const names = appt.legs
    .map((l) => serviceById.get(l.serviceId)?.name)
    .filter(Boolean)
    .join(", ");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Beauty Spot//Preview//EN",
    "BEGIN:VEVENT",
    `UID:${appt.id}@tbs.legxcysol.dev`,
    `DTSTAMP:${stamp(appt.legs[0].start)}`,
    `DTSTART;TZID=Europe/London:${stamp(appt.legs[0].start)}`,
    `DTEND;TZID=Europe/London:${stamp(appt.legs[appt.legs.length - 1].end)}`,
    `SUMMARY:Preview only: ${names}`,
    "DESCRIPTION:Showcase booking. No appointment has been made with the salon.",
    "LOCATION:14a High Street\\, Sandy\\, Bedfordshire SG19 1AG",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/* ---------- salon-side summaries ---------- */

export function largestGap(date: string, items: DiaryItem[]) {
  const open = openingFor(date);
  if (!open) return null;
  let best: { therapistId: string; start: number; end: number } | null = null;
  for (const t of therapists) {
    if (!worksOn(t.id, date)) continue;
    let at = open[0];
    const mine = items.filter((i) => i.therapistId === t.id);
    for (const i of [...mine, { start: open[1], end: open[1] }]) {
      if (i.start > at && (!best || i.start - at > best.end - best.start))
        best = { therapistId: t.id, start: at, end: i.start };
      at = Math.max(at, i.end);
    }
  }
  return best;
}
