import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Sansita_Swashed } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionRoot } from "@/components/motion-root";
import { Tray } from "@/components/tray";
import { business } from "@/lib/site";
import "./globals.css";

const sansita = Sansita_Swashed({ variable: "--font-sansita", subsets: ["latin"], display: "swap" });
const familjen = Familjen_Grotesk({ variable: "--font-familjen", subsets: ["latin"], display: "swap" });

const indexable = process.env.SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: "The Beauty Spot | Beauty salon in Sandy, Bedfordshire",
    template: "%s | The Beauty Spot, Sandy",
  },
  description:
    "Facials, lashes, nails, massage and waxing on Sandy High Street, close to Biggleswade, Potton and St Neots. See live times and book your treatment online.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "The Beauty Spot",
    title: "The Beauty Spot | Feel good from top to toe",
    description: "Facials, lashes, nails, massage and waxing on Sandy High Street.",
  },
  robots: indexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#5a314c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sansita.variable} ${familjen.variable}`}
    >
      <head>
        {/* Applies a saved theme before first paint, so the page never flashes the wrong one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("tbs-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="btn btn-plum sr-only z-90 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <MotionRoot>
          <Header />
          <main id="main" className="grow">
            {children}
          </main>
          <Footer />
          <Tray />
        </MotionRoot>
      </body>
    </html>
  );
}
