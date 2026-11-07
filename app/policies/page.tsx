import type { Metadata } from "next";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Policies",
  description: "Cancellations, vouchers and how this site handles your information.",
};

const sections = [
  {
    id: "cancellations",
    title: "Cancellations",
    body: [
      "Failing to cancel your booked appointment at least 24 hours beforehand will result in a 50% cancellation fee.",
      "You can move or cancel an appointment yourself, and the fee is shown clearly before you confirm any change inside the 24 hours.",
    ],
  },
  {
    id: "vouchers",
    title: "Gift vouchers",
    body: ["All vouchers have an expiry of 12 months from the date of purchase."],
  },
  {
    id: "privacy",
    title: "Your information on this site",
    body: [
      "This site is a private preview. It doesn't set tracking or advertising cookies and doesn't run analytics.",
      "Anything you enter in the booking flow stays in your own browser's storage. It isn't sent to the salon or to anyone else, and clearing your browser data removes it.",
    ],
  },
  {
    id: "concept",
    title: "About this preview",
    body: [
      "This site is an unofficial concept. It isn't affiliated with or endorsed by The Beauty Spot Sandy, and nothing booked here creates a real appointment. Salon details, prices, reviews and photographs are shown as published on the salon's own website.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <PageHead kicker="Policies" title="The sensible bits." />
      <div className="wrap-page max-w-3xl space-y-10 py-14 sm:py-20">
        {sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-display text-3xl text-accent">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-lg">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
