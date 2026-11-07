"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useStore } from "@/lib/store";

const subscribe = (listener: () => void) => {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
};

export function ScrollTop() {
  const scrolled = useSyncExternalStore(subscribe, () => window.scrollY > 600, () => false);
  const { tray } = useStore();
  const path = usePathname();
  // Clears the appointment tray, which spans the full width on smaller screens.
  const trayShowing = tray.length > 0 && !path.startsWith("/book") && !path.startsWith("/studio");

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => {
            window.scrollTo({ top: 0 });
            // The button is about to disappear, so keyboard focus moves to the top of the page.
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          style={{ viewTransitionName: "site-top" }}
          className={`on-dark fixed right-3 z-30 flex size-11 items-center justify-center rounded-full bg-plum text-porcelain shadow-lg ring-1 ring-porcelain/30 transition-colors hover:bg-aubergine sm:right-5 lg:bottom-5 ${trayShowing ? "bottom-20" : "bottom-3 sm:bottom-5"}`}
        >
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
