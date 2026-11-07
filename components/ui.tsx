"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { actions } from "@/lib/store";

export function PageHead({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="on-dark bg-plum text-porcelain">
      <div className="wrap-page py-12 sm:py-16">
        {kicker && <p className="font-medium text-champagne">{kicker}</p>}
        <h1 className="mt-2 max-w-4xl font-display text-5xl leading-[1.02] text-balance sm:text-7xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg text-porcelain/90">{children}</div>}
      </div>
    </div>
  );
}

export function BookWith({ id, name }: { id: string; name: string }) {
  return (
    <Link
      href="/book"
      onClick={() => actions.setTherapist(id)}
      className="mt-3 inline-flex min-h-8 items-center font-semibold text-accent underline underline-offset-4 hover:opacity-75"
    >
      Book with {name}
    </Link>
  );
}
