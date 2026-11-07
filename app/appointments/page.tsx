import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { Manage } from "./manage";

export const metadata: Metadata = {
  title: "My appointments",
  description: "Move or cancel your appointments at The Beauty Spot.",
};

export default function AppointmentsPage() {
  return (
    <>
      <PageHead kicker="My appointments" title="Plans change. That's fine." />
      <Manage />
    </>
  );
}
