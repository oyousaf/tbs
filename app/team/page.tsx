import type { Metadata } from "next";
import Image from "next/image";
import { BookWith, PageHead } from "@/components/ui";
import { reviews, team } from "@/lib/people";

export const metadata: Metadata = {
  title: "Meet the team",
  description: "Meet Beverley, Clare, Ellie-Mai and Gracie, the qualified and fully insured team at The Beauty Spot in Sandy.",
};

export default function TeamPage() {
  return (
    <>
      <PageHead kicker="Our team" title="Your first visit won't be your last.">
        <p>Our therapists are all highly qualified and fully insured, and the whole team regularly attends the latest courses to keep standards high.</p>
      </PageHead>
      <div className="wrap-page divide-y divide-accent/15 py-10 sm:py-14">
        {team.map((t, i) => {
          const quote = reviews.find((r) => r.therapist === t.id);
          return (
            <article key={t.id} className="grid items-center gap-8 py-10 md:grid-cols-12">
              <div className={`relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-full bg-panel md:col-span-4 ${i % 2 ? "md:order-last md:col-start-9" : ""}`}>
                <Image src={t.image} alt={`Portrait of ${t.name}`} fill sizes="(min-width: 768px) 30vw, 320px" className="object-cover object-top" />
              </div>
              <div className={`md:col-span-7 ${i % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-6"}`}>
                <h2 className="font-display text-5xl text-accent sm:text-6xl">{t.name}</h2>
                <p className="mt-1 font-medium text-muted">{t.role}</p>
                <p className="mt-4 max-w-xl text-lg">{t.bio}</p>
                {quote && (
                  <figure className="mt-5 max-w-xl border-l-4 border-accent pl-4">
                    <blockquote className="text-muted">&ldquo;{quote.text}&rdquo;</blockquote>
                    <figcaption className="mt-1 text-sm font-semibold text-accent">{quote.name}</figcaption>
                  </figure>
                )}
                {t.bookable && <BookWith id={t.id} name={t.name} />}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
