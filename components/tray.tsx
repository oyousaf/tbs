"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { duration, gbp, servicesFor } from "@/lib/menu";
import { useStore } from "@/lib/store";

/** The appointment tray: follows you around the site as you add treatments. */
export function Tray() {
  const { tray } = useStore();
  const path = usePathname();
  const list = servicesFor(tray);
  const hidden = path.startsWith("/book") || path.startsWith("/studio");
  const show = list.length > 0 && !hidden;
  const minutes = list.reduce((a, s) => a + s.minutes, 0);
  const pence = list.reduce((a, s) => a + s.pence, 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          aria-label="Your appointment"
          style={{ viewTransitionName: "site-tray" }}
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="on-dark fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full bg-aubergine py-2 pr-2 pl-5 text-porcelain shadow-xl ring-1 ring-porcelain/20 sm:pl-6"
        >
          <p className="min-w-0 text-sm leading-tight sm:text-base" aria-live="polite">
            <span className="font-semibold">
              {list.length} {list.length === 1 ? "treatment" : "treatments"}
            </span>
            <span className="block text-porcelain/80 sm:inline sm:before:content-['_·_']">
              about {duration(minutes)}, {gbp(pence)}
            </span>
          </p>
          <Link href="/book?step=therapist" className="btn btn-champagne shrink-0">
            Choose a time
          </Link>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
