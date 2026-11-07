import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { ReviewWall } from "./wall";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What clients say about their treatments with Clare, Ellie-Mai and Gracie at The Beauty Spot in Sandy.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHead kicker="Reviews" title="Don't take our word for it.">
        <p>Reviews from clients of the current team, in their own words.</p>
      </PageHead>
      <ReviewWall />
    </>
  );
}
