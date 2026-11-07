import type { Metadata } from "next";
import { BookingFlow } from "./flow";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Choose your treatments, pick a therapist and see real times at The Beauty Spot in Sandy.",
};

export default function BookPage() {
  return <BookingFlow />;
}
