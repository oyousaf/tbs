"use client";

import { useState } from "react";
import { Pills, Swap } from "@/components/tabs";
import { reviews, therapistById, therapists } from "@/lib/people";

const monthYear = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export function ReviewWall() {
  const [who, setWho] = useState("all");
  const shown = reviews.filter((r) => who === "all" || r.therapist === who);
  return (
    <div className="wrap-page py-10 sm:py-14">
      <Pills
        group="review-who"
        label="Filter by therapist"
        value={who}
        onChange={setWho}
        options={[{ id: "all", label: "Everyone" }, ...therapists.map((t) => ({ id: t.id, label: t.name }))]}
      />
      <p className="sr-only" aria-live="polite">{shown.length} reviews shown</p>
      <Swap id={who}>
        <div className="mt-10 columns-1 gap-5 md:columns-2 xl:columns-3">
          {shown.map((r) => (
            <figure key={`${r.name}${r.date}${r.therapist}`} className="mb-5 break-inside-avoid rounded-3xl bg-panel p-6">
              <span aria-hidden className="block size-3 rounded-full bg-accent" />
              <blockquote className="mt-4 text-lg">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-accent">{r.name}</span>
                <span className="text-muted"> · with {therapistById.get(r.therapist)?.name} · {monthYear(r.date)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Swap>
    </div>
  );
}
