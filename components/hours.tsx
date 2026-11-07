"use client";

import { clock } from "@/lib/engine";
import { dayNames, hours, weekOrder } from "@/lib/site";
import { useNow } from "@/lib/store";

export function HoursList({ className, accent = "text-accent" }: { className?: string; accent?: string }) {
  const now = useNow();
  const today = now === null ? null : new Date(now).getDay();
  return (
    <dl className={className}>
      {weekOrder.map((d) => {
        const h = hours[d];
        const isToday = d === today;
        return (
          <div key={d} className={`flex justify-between gap-4 py-0.5 tabular-nums ${isToday ? `font-semibold ${accent}` : ""}`}>
            <dt>
              {dayNames[d]}
              {isToday && <span className="sr-only"> (today)</span>}
            </dt>
            <dd>{h ? `${clock(h[0])} to ${clock(h[1])}` : "Closed"}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function OpenNow({ className }: { className?: string }) {
  const now = useNow();
  if (now === null) return <span className={className}>&nbsp;</span>;
  const d = new Date(now);
  const h = hours[d.getDay()];
  const mins = d.getHours() * 60 + d.getMinutes();
  const open = h && mins >= h[0] && mins < h[1];
  let text = `Open until ${h ? clock(h[1]) : ""} today`;
  if (!open) {
    if (h && mins < h[0]) text = `Opens at ${clock(h[0])} today`;
    else {
      let i = 1;
      while (!hours[(d.getDay() + i) % 7]) i++;
      const day = (d.getDay() + i) % 7;
      text = `Closed now. Opens ${i === 1 ? "tomorrow" : dayNames[day]} at ${clock(hours[day]![0])}`;
    }
  }
  return <span className={className}>{text}</span>;
}
