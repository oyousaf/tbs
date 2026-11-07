import type { Metadata } from "next";
import { Studio } from "./studio";

export const metadata: Metadata = {
  title: "Salon diary",
  description: "The salon side of the booking system: diary, waitlist and clients.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <Studio />;
}
