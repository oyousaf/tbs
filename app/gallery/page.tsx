import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { GalleryGrid } from "./grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Take a look inside The Beauty Spot on Sandy High Street.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHead kicker="Gallery" title="Have a look round." />
      <GalleryGrid />
    </>
  );
}
