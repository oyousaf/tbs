"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RegionMenu } from "@/components/menu-list";
import { QuickFind } from "@/components/quick-find";
import { regions, services, type RegionId } from "@/lib/menu";

const stops: { id: RegionId; name: string }[] = [...regions, { id: "packages", name: "All of it" }];

export function TreatmentsMenu() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = (id: RegionId) =>
    services.some((s) => s.region === id && (!q || `${s.name} ${s.group}`.toLowerCase().includes(q)));
  const visible = stops.filter((s) => matches(s.id));
  const [active, setActive] = useState<RegionId>("face");

  // The highlight follows you down the menu, top to toe.
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const current = stops.find((s) => seen.get(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const s of stops) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [query]);

  return (
    <>
      <div className="sticky top-18 z-20 border-b border-accent/15 bg-page/95 backdrop-blur-sm">
        <div className="wrap-page flex items-center gap-4 py-2">
          <nav aria-label="Jump to" className="min-w-0 grow overflow-x-auto">
            <ul className="flex gap-1">
              {stops.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className={`relative inline-flex min-h-11 items-center rounded-full px-3 font-medium whitespace-nowrap transition-colors duration-200 ${active === s.id ? "text-porcelain" : "hover:bg-panel"}`}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="pill-treatments"
                        aria-hidden
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-plum"
                      />
                    )}
                    <span className="relative">{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden w-64 shrink-0 md:block">
            <label htmlFor="menu-search" className="sr-only">Filter the menu</label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter the menu"
              className="field"
            />
          </div>
        </div>
      </div>

      <div className="wrap-page py-10">
        <div className="mb-6 md:hidden">
          <label htmlFor="menu-search-mobile" className="mb-1 block font-medium">Filter the menu</label>
          <input id="menu-search-mobile" type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="field" />
        </div>
        <QuickFind />
      </div>

      <div className="wrap-page space-y-20 pb-24">
        {visible.length === 0 && (
          <p className="text-lg">Nothing on the menu matches &ldquo;{query}&rdquo;. Try another word, or clear the filter.</p>
        )}
        {visible.map((stop) => {
          const region = regions.find((r) => r.id === stop.id);
          return (
            <section key={stop.id} id={stop.id} aria-labelledby={`${stop.id}-h`} className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-40">
                  <h2 id={`${stop.id}-h`} className="font-display text-6xl text-accent sm:text-7xl">{stop.name}</h2>
                  <p className="mt-2 text-lg text-muted">{region?.line ?? "When one treatment simply won't do."}</p>
                  <div className="relative mt-6 hidden aspect-square w-3/4 overflow-hidden rounded-full lg:block">
                    <Image
                      src={region?.image ?? "/images/roses.webp"}
                      alt={region?.alt ?? "A vase of cream roses in the waiting area"}
                      fill
                      sizes="24vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <RegionMenu region={stop.id} query={query} />
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
