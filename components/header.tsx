"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { business, navLinks } from "@/lib/site";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const path = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const close = () => menu.current?.close();

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-accent/15 bg-page/95 backdrop-blur-sm"
    >
      <div className="wrap-page flex h-18 items-center justify-between gap-6">
        <Link href="/" transitionTypes={["home"]} className="-my-2 flex min-h-11 items-center py-2 text-accent">
          <Logo className="h-6 w-auto sm:h-7" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((l) => {
              const current = path.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center gap-2 font-medium hover:text-accent ${current ? "text-accent" : "text-ink"}`}
                  >
                    {current && <span aria-hidden className="size-2 rounded-full bg-accent" />}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href={business.phoneHref} className="hidden min-h-11 items-center font-medium underline-offset-4 hover:underline xl:inline-flex">
            {business.phone}
          </a>
          <ThemeToggle className="hidden text-accent hover:bg-panel lg:inline-flex" />
          <Link href="/book" className="btn btn-plum">
            Book
          </Link>
          <button
            type="button"
            className="btn btn-line px-4! lg:hidden"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            Menu
          </button>
        </div>
      </div>

      <dialog
        ref={menu}
        aria-label="Menu"
        className="menu-sheet on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-plum text-porcelain"
      >
        <div className="wrap-page flex h-full flex-col py-5">
          <div className="flex items-center justify-between">
            <Logo className="h-6 w-auto" spot="var(--color-champagne)" />
            <button type="button" onClick={close} className="btn border-[1.5px] border-porcelain">
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 grow">
            <ul className="space-y-1">
              {[{ href: "/", label: "Home" }, ...navLinks, { href: "/book", label: "Book" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    transitionTypes={l.href === "/" ? ["home"] : undefined}
                    onClick={close}
                    className="block py-2 font-display text-4xl hover:text-champagne"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a href={business.phoneHref} className="py-3 text-lg font-medium underline underline-offset-4">
              Call {business.phone}
            </a>
            <ThemeToggle labelled className="border-[1.5px] border-porcelain" />
          </div>
        </div>
      </dialog>
    </header>
  );
}
