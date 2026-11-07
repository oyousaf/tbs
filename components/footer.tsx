"use client";

import Link from "next/link";
import { useNow } from "@/lib/store";
import { business, footerLinks, navLinks } from "@/lib/site";
import { HoursList } from "./hours";
import { Logo } from "./logo";

export function Footer() {
  const now = useNow();
  const year = now ? new Date(now).getFullYear() : 2026;
  return (
    <footer className="on-dark bg-aubergine pb-28 text-porcelain lg:pb-0">
      <div className="wrap-page grid gap-12 py-16 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-9 w-auto sm:h-11" spot="var(--color-champagne)" />
          <p className="mt-5 max-w-sm text-porcelain/85">
            Pampering from head to toe, on Sandy High Street. Close to Biggleswade, Potton and St Neots.
          </p>
          <Link href="/book" className="btn btn-champagne mt-6">
            Find a time
          </Link>
        </div>
        <div>
          <h2 className="font-display text-xl text-champagne">Find us</h2>
          <address className="mt-4 space-y-1 not-italic text-porcelain/90">
            <p>{business.street}</p>
            <p>{business.town}, {business.county}</p>
            <p>{business.postcode}</p>
            <p className="pt-2">
              <a href={business.phoneHref} className="underline underline-offset-4 hover:text-champagne">
                {business.phone}
              </a>
            </p>
          </address>
          <ul className="mt-4 flex gap-5">
            <li>
              <a href={business.instagram} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-champagne">
                Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={business.facebook} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-champagne">
                Facebook<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl text-champagne">Opening times</h2>
          <HoursList className="mt-4 max-w-64 text-porcelain/90" accent="text-champagne" />
        </div>
        <nav aria-label="Footer">
          <h2 className="font-display text-xl text-champagne">Explore</h2>
          <ul className="mt-3">
            {[...navLinks, ...footerLinks].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-champagne hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-porcelain/20">
        <div className="wrap-page flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-5 text-sm text-porcelain/80">
          <p>&copy; {year} {business.legalName}</p>
          <p>Unofficial concept preview. Not affiliated with or endorsed by the salon.</p>
          <p>
            Built with{" "}
            <span className="inline-block motion-safe:animate-heartbeat" role="img" aria-label="love">
              💚
            </span>{" "}
            by{" "}
            <a href="https://legxcysol.dev" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-champagne">
              Legxcy Solutions<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
