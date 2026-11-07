import type { Metadata } from "next";
import Image from "next/image";
import { HoursList, OpenNow } from "@/components/hours";
import { PageHead } from "@/components/ui";
import { business } from "@/lib/site";
import { ContactForm } from "./form";

export const metadata: Metadata = {
  title: "Visit and contact",
  description: "Find The Beauty Spot at 14a High Street, Sandy, Bedfordshire SG19 1AG. Close to Biggleswade, Potton and St Neots. Call 01767 680766.",
};

export default function VisitPage() {
  return (
    <>
      <PageHead kicker="Visit" title="14a High Street, Sandy.">
        <p>Close to Biggleswade, Potton and St Neots. Please leave a message if we don&rsquo;t answer, and we&rsquo;ll call you back as soon as we&rsquo;re free.</p>
      </PageHead>
      <div className="wrap-page grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-lg font-semibold text-sage"><OpenNow /></p>
          <h2 className="mt-5 font-display text-3xl text-accent">Opening times</h2>
          <HoursList className="mt-3 max-w-sm" />
          <h2 className="mt-10 font-display text-3xl text-accent">Find us</h2>
          <address className="mt-3 not-italic">
            {business.street}<br />{business.town}, {business.county}<br />{business.postcode}
          </address>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={business.mapsHref} target="_blank" rel="noopener" className="btn btn-plum">
              Get directions<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={business.phoneHref} className="btn btn-line">Call {business.phone}</a>
          </div>
          <div className="relative mt-10 aspect-4/3 overflow-hidden rounded-3xl">
            <Image src="/images/shopfront.webp" alt="The Beauty Spot's shopfront window on Sandy High Street" fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-4xl text-accent">Ask us anything</h2>
          <p className="mt-2 text-muted">Not sure which treatment suits you? Send a note and a therapist will get back to you.</p>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
