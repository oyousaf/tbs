import type { Metadata } from "next";
import { TreatmentsMenu } from "./menu";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Treatments and prices",
  description:
    "The full menu at The Beauty Spot, Sandy: Guinot facials, microneedling, brows and lashes, Mii nails, massage, waxing, electrolysis and pampering packages.",
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHead kicker="Top to toe" title="Everything we do, and what it costs.">
        <p>Add what you fancy as you go. Your appointment follows you round the site until you&rsquo;re ready to pick a time.</p>
      </PageHead>
      <TreatmentsMenu />
    </>
  );
}
