import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { VoucherBuilder } from "./voucher";

export const metadata: Metadata = {
  title: "Gift vouchers and Treat Points",
  description: "Buy a gift voucher for The Beauty Spot in Sandy, and collect Treat Points on every treatment you have.",
};

const earn = [
  { pts: "1", text: "point for every £1 you spend on treatments" },
  { pts: "50", text: "points when you successfully refer a friend" },
  { pts: "20", text: "bonus points for reviewing a treatment on social media" },
  { pts: "10", text: "extra points for posting a review selfie with us" },
];

const terms = [
  "Treat Points have no cash value and cannot be exchanged as part payment towards a treatment.",
  "Treat Points are non-transferable. The card presented at redemption must belong to the person booking the treatment.",
  "Treat Point appointments cannot be used with another salon voucher or offer. All other treatments must be full paying treatments.",
  "All collected points must tally with our booking system, and we reserve the right to refuse the free treatment accordingly.",
];

export default function GiftsPage() {
  return (
    <>
      <PageHead kicker="Gifts and points" title="Good things, for you or someone you like." />
      <VoucherBuilder />
      <section id="points" className="on-dark bg-aubergine text-porcelain">
        <div className="wrap-page py-16 sm:py-24">
          <h2 className="font-display text-5xl sm:text-6xl">Treat Points</h2>
          <p className="mt-3 max-w-xl text-lg text-porcelain/90">Collect and spend points that reward you at The Beauty Spot. Need a card? Pick one up next time you visit.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {earn.map((e) => (
              <li key={e.text} className="rounded-3xl bg-plum p-6">
                <p className="font-display text-6xl text-champagne">{e.pts}</p>
                <p className="mt-2">{e.text}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-12 font-display text-2xl text-champagne">The small print</h3>
          <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-5 text-porcelain/90">
            {terms.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
