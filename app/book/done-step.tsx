"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { AppointmentCard } from "@/components/appointment-card";
import type { Appointment } from "@/lib/engine";
import { business } from "@/lib/site";

export function DoneStep({
  appointment,
  headingRef,
}: {
  appointment: Appointment;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <div className="on-dark bg-plum text-porcelain">
        <div className="wrap-page py-12 sm:py-16">
          <span aria-hidden className="block size-10 rounded-full bg-champagne" />
          <h1 ref={headingRef} tabIndex={-1} className="mt-5 font-display text-5xl leading-[1.02] outline-hidden sm:text-7xl">
            That&rsquo;s how easy it would be.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-porcelain/90">
            This was a preview, so <strong>no appointment has been made</strong> and the salon hasn&rsquo;t been contacted. To book for real, call{" "}
            <a href={business.phoneHref} className="font-semibold underline underline-offset-4">{business.phone}</a>.
          </p>
        </div>
      </div>
      <div className="wrap-page grid gap-8 py-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AppointmentCard appointment={appointment} />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="font-display text-3xl text-accent">See both sides</h2>
          <p className="mt-2 text-muted">Your preview appointment has landed in the salon&rsquo;s diary, exactly as staff would see it.</p>
          <div className="mt-5 flex flex-col items-start gap-3">
            <Link href="/studio" className="btn btn-plum">Open the salon diary</Link>
            <Link href="/appointments" className="btn btn-line">Manage this appointment</Link>
            <Link href="/" className="min-h-8 font-medium text-accent underline underline-offset-4">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
