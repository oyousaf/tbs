"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fromPrice, gbp, regions } from "@/lib/menu";

/** The salon's "top to toe" line, used as the page's actual navigation: a plumb line runs head to foot. */
export function Hero() {
  const [active, setActive] = useState(0);
  return (
    <section className="on-dark relative overflow-hidden bg-plum text-porcelain">
      <div aria-hidden className="absolute -right-40 -bottom-56 size-176 rounded-full bg-accent-deep" />
      <div className="wrap-page relative grid gap-10 py-12 md:py-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-5">
          <p className="font-medium text-champagne">Beauty salon on Sandy High Street</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.98] text-balance sm:text-7xl xl:text-8xl">
            Feel good from top to toe.
          </h1>
          <p className="mt-6 max-w-md text-lg text-porcelain/90">
            Facials, lashes, nails, massage and waxing from a team who know you by name. Pick where to start, and see real times straight away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-champagne">
              Find a time
            </Link>
            <Link href="/treatments" className="btn border-[1.5px] border-porcelain hover:bg-porcelain hover:text-aubergine">
              See the full menu
            </Link>
          </div>
        </div>

        <nav aria-label="Treatments, top to toe" className="relative lg:col-span-4 lg:col-start-6">
          <span aria-hidden className="absolute top-3 bottom-3 left-2 w-px bg-page/40" />
          <ul>
            {regions.map((r, i) => (
              <li key={r.id}>
                <Link
                  href={`/treatments#${r.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative flex items-baseline justify-between gap-4 py-1.5 pl-9 sm:py-2"
                >
                  {active === i && (
                    <motion.span
                      layoutId="spot"
                      aria-hidden
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute top-1/2 left-0 -mt-2.25 size-4.5 rounded-full bg-champagne"
                    />
                  )}
                  <span className={`font-display text-5xl transition-colors sm:text-6xl ${active === i ? "text-champagne" : ""}`}>
                    {r.name}
                  </span>
                  <span className="shrink-0 text-sm text-porcelain/85 tabular-nums">
                    from {gbp(fromPrice(r.id))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 pl-9 text-porcelain/90" aria-live="polite">
            {regions[active].line}
          </p>
        </nav>

        <div className="relative mx-auto aspect-square w-full max-w-sm lg:col-span-3 lg:max-w-none">
          <div className="absolute inset-0 overflow-hidden rounded-full bg-plum-deep">
            <Image
              src="/images/room.webp"
              alt="A treatment room at The Beauty Spot, the couch dressed in plum towels"
              fill
              preload
              sizes="(min-width: 1024px) 26vw, 384px"
              className="object-cover object-[50%_70%]"
            />
            {regions.map((r, i) => (
              <Image
                key={r.id}
                src={r.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 26vw, 384px"
                className={`object-cover transition-opacity duration-500 ${active === i && i !== 0 ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          <span aria-hidden className="absolute top-[6%] right-[6%] size-[12%] rounded-full bg-champagne" />
        </div>
      </div>
    </section>
  );
}
