import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { OpenNow, HoursList } from "@/components/hours";
import { NextFree } from "@/components/next-free";
import { Reveal } from "@/components/reveal";
import { BookWith } from "@/components/ui";
import { reviews, team } from "@/lib/people";
import { business, hours } from "@/lib/site";

const dayCodes = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const schema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: business.legalName,
  url: business.url,
  telephone: "+441767680766",
  image: `${business.url}/images/lounge.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.town,
    addressRegion: business.county,
    postalCode: business.postcode,
    addressCountry: "GB",
  },
  areaServed: ["Sandy", "Biggleswade", "Potton", "St Neots"],
  sameAs: [business.facebook, business.instagram],
  openingHoursSpecification: hours.flatMap((h, d) =>
    h ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: dayCodes[d], opens: toTime(h[0]), closes: toTime(h[1]) }] : [],
  ),
};

export default function Home() {
  const [lead, ...rest] = reviews;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Hero />

      <section className="wrap-page py-20 sm:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="max-w-2xl font-display text-5xl leading-[1.02] text-balance text-accent sm:text-6xl">
              Free this week, if you fancy it.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              The diary, without the phone tag. See what&rsquo;s open, pick a therapist or let us choose, and you&rsquo;re done in under a minute.
            </p>
          </div>
          <Link href="/book" className="btn btn-plum">
            See every time
          </Link>
        </Reveal>
        <Reveal className="mt-10">
          <NextFree />
        </Reveal>
      </section>

      <section className="bg-panel">
        <div className="wrap-page grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <span aria-hidden className="block size-6 rounded-full bg-accent" />
            <figure className="mt-6">
              <blockquote className="font-display text-3xl leading-[1.15] text-accent sm:text-5xl">
                &ldquo;{lead.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-medium">{lead.name}, on a treatment with Ellie-Mai</figcaption>
            </figure>
            <Link href="/reviews" className="btn btn-line mt-8">
              Read more reviews
            </Link>
          </Reveal>
          <Reveal className="space-y-4 lg:col-span-4 lg:col-start-9" delay={0.1}>
            {rest.slice(0, 3).map((r) => (
              <figure key={r.text} className="rounded-2xl bg-page p-5">
                <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-accent">{r.name}</figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="wrap-page py-20 sm:py-28">
        <Reveal>
          <h2 className="max-w-3xl font-display text-5xl leading-[1.02] text-balance text-accent sm:text-6xl">
            A small team you&rsquo;ll ask for by name.
          </h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {team.map((t, i) => (
            <li key={t.id}>
              <Reveal delay={i * 0.06}>
                <div className="relative aspect-square overflow-hidden rounded-full bg-panel">
                  <Image src={t.image} alt={`Portrait of ${t.name}`} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover object-top" />
                </div>
                <h3 className="mt-4 font-display text-2xl text-accent">{t.name}</h3>
                <p className="text-sm text-muted">{t.role}</p>
                {t.bookable && <BookWith id={t.id} name={t.name} />}
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-dark bg-aubergine text-porcelain">
        <div className="wrap-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[1.6] rotate-[-2deg] rounded-3xl bg-plum p-7 shadow-2xl sm:p-10">
              <span aria-hidden className="absolute top-7 right-7 size-14 rounded-full bg-champagne sm:top-10 sm:right-10 sm:size-20" />
              <p className="font-display text-3xl sm:text-4xl">the gift of a good day</p>
              <p className="absolute bottom-7 left-7 text-porcelain/90 sm:bottom-10 sm:left-10">Valid for 12 months from purchase</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl leading-[1.02] text-balance sm:text-6xl">Treat someone special. Or yourself, we won&rsquo;t tell.</h2>
            <p className="mt-5 max-w-lg text-lg text-porcelain/90">
              Vouchers go straight to your inbox or theirs. And every £1 you spend on treatments earns you a Treat Point towards something free.
            </p>
            <Link href="/gifts" className="btn btn-champagne mt-8">
              Gifts and Treat Points
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="wrap-page grid gap-10 py-20 sm:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-5xl leading-[1.02] text-accent sm:text-6xl">Come and see us.</h2>
          <p className="mt-4 text-lg font-semibold text-sage">
            <OpenNow />
          </p>
          <address className="mt-4 text-lg not-italic">
            {business.street}, {business.town}, {business.county}, {business.postcode}
          </address>
          <HoursList className="mt-6 max-w-sm" />
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={business.mapsHref} target="_blank" rel="noopener" className="btn btn-plum">
              Get directions<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={business.phoneHref} className="btn btn-line">
              Call {business.phone}
            </a>
          </div>
        </Reveal>
        <Reveal className="grid grid-cols-5 gap-4 lg:col-span-6 lg:col-start-7" delay={0.1}>
          <div className="relative col-span-3 aspect-3/4 overflow-hidden rounded-3xl">
            <Image src="/images/lounge.webp" alt="The salon's waiting area with grey armchairs and flowers" fill sizes="(min-width: 1024px) 28vw, 58vw" className="object-cover" />
          </div>
          <div className="col-span-2 flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image src="/images/roses.webp" alt="A vase of cream roses" fill sizes="(min-width: 1024px) 18vw, 38vw" className="object-cover" />
            </div>
            <div className="relative grow overflow-hidden rounded-3xl">
              <Image src="/images/reception.webp" alt="The curved reception desk" fill sizes="(min-width: 1024px) 18vw, 38vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
