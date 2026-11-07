export type RegionId = "face" | "eyes" | "hands" | "body" | "feet" | "packages";

export type Skill =
  | "guinot"
  | "facial"
  | "micro"
  | "electro"
  | "brows"
  | "lashes"
  | "nails"
  | "wax"
  | "massage"
  | "package";

export type Service = {
  id: string;
  name: string;
  region: RegionId;
  group: string;
  /** Minutes the diary reserves for this treatment. */
  minutes: number;
  /** True when the salon doesn't publish a time; `minutes` is then a diary estimate and is hidden on the menu. */
  estimated?: boolean;
  pence: number;
  fromPrice?: boolean;
  note?: string;
  skill: Skill;
  resource: "room" | "nails";
  gate?: "micro" | "electro";
  patch?: boolean;
};

export const regions: {
  id: RegionId;
  name: string;
  image: string;
  alt: string;
  line: string;
}[] = [
  {
    id: "face",
    name: "Face",
    image: "/images/facial.webp",
    alt: "A therapist smiling while giving a client a Guinot facial",
    line: "Guinot facials, microneedling and electrolysis.",
  },
  {
    id: "eyes",
    name: "Eyes",
    image: "/images/lashes.webp",
    alt: "Close-up of a brown eye with full Russian volume lashes",
    line: "Brows, tints, LVL and lash extensions.",
  },
  {
    id: "hands",
    name: "Hands",
    image: "/images/polish.webp",
    alt: "Bottles of nail polish arranged on a white salon shelf with flowers",
    line: "Mii manicures, gels and quick tidy-ups.",
  },
  {
    id: "body",
    name: "Body",
    image: "/images/massage.webp",
    alt: "A therapist's hands massaging a client's back",
    line: "Aromatherapy massage, hot stones, scrubs and waxing.",
  },
  {
    id: "feet",
    name: "Feet",
    image: "/images/towels.webp",
    alt: "A stack of soft towels in plum and neutral tones",
    line: "Mii pedicures, gels and file and polish.",
  },
];

export const groupIntros: Record<string, string> = {
  "Guinot facials":
    "Guinot's Hydradermie machine uses gentle dual ionisation and thermal currents to carry ingredients deeper into the skin. Your therapist will help you choose what suits your skin.",
  "Beauty Spot facials":
    "Our hands-on manual facials, for when you want the calm of a facial in a shorter visit.",
  Microneedling:
    "Every course starts with a free consultation, so we can agree what's right for your skin first.",
  Electrolysis:
    "Sylvia Lewis method electrolysis permanently removes unwanted facial hair from the root. An initial consultation is required and is free on request.",
  "Brows and lashes":
    "From a quick shape to full Russian volume. Fullness, density and length are discussed with your technician first, so you get the look you have in mind.",
  "Mii manicures":
    "Your nails are assessed first, then a choice of Mii products is matched to your nail type to keep them healthy.",
  "Mii pedicures":
    "The same assessed, nourishing Mii approach, for feet that have earned a little attention.",
  Massage:
    "Our therapists are Aromatherapy Associates trained. Each massage combines a consultation, massage technique and the power of aromatherapy.",
  Waxing:
    "Available to both men and women in our relaxed, discreet salon. Strip wax unless stated.",
  Packages: "When one treatment simply won't do.",
};

const s = (
  id: string,
  region: RegionId,
  group: string,
  skill: Skill,
  name: string,
  minutes: number,
  pounds: number,
  extra: Partial<Service> = {},
): Service => ({
  id,
  region,
  group,
  skill,
  name,
  minutes,
  pence: Math.round(pounds * 100),
  resource: region === "hands" || region === "feet" ? "nails" : "room",
  ...extra,
});

const G = "Guinot facials";
const F = "Beauty Spot facials";
const M = "Microneedling";
const E = "Electrolysis";
const B = "Brows and lashes";
const H = "Mii manicures";
const P = "Mii pedicures";
const K = "Massage";
const W = "Waxing";
const est = { estimated: true };

export const services: Service[] = [
  s("hd-lift-express", "face", G, "guinot", "Hydradermie Lift Express", 30, 41.8, { note: "Course of 8: £263.34" }),
  s("hd-lift", "face", G, "guinot", "Hydradermie Lift", 75, 82.5, { note: "Course of 3: £214.65" }),
  s("hd-lift-deluxe", "face", G, "guinot", "Hydradermie Lift Deluxe", 105, 108.9),
  s("hd-youth", "face", G, "guinot", "Hydradermie Youth", 75, 79.5),
  s("hd-youth-age", "face", G, "guinot", "Hydradermie Youth Age Logic", 75, 83.5),
  s("age-summum", "face", G, "guinot", "Age Summum", 60, 85, { note: "Course of 3: £229.50" }),
  s("detoxygene", "face", G, "guinot", "Detoxygene", 60, 68.5),
  s("hydraclean", "face", G, "guinot", "Hydraclean", 45, 55),
  s("express-facial", "face", F, "facial", "Express Facial", 30, 42.35),
  s("extended-facial", "face", F, "facial", "Extended Facial", 45, 60.5),
  s("micro-consult", "face", M, "micro", "Microneedling consultation", 30, 0, est),
  s("micro", "face", M, "micro", "Microneedling treatment", 60, 120, { ...est, fromPrice: true, gate: "micro" }),
  s("micro-ha", "face", M, "micro", "Hyaluronic acid + B5 serum, course of 3", 60, 320, { ...est, gate: "micro" }),
  s("micro-pigment", "face", M, "micro", "Anti-pigmentation serum, course of 3", 60, 350, { ...est, gate: "micro" }),
  s("micro-nad", "face", M, "micro", "NAD+ collagen boosting serum, course of 3", 60, 380, { ...est, gate: "micro" }),
  s("electro-consult", "face", E, "electro", "Electrolysis consultation", 15, 0, { ...est, note: "Free on request" }),
  s("electro-10", "face", E, "electro", "Electrolysis, 10 minutes", 10, 24.2, { gate: "electro" }),
  s("electro-15", "face", E, "electro", "Electrolysis, 15 minutes", 15, 27.5, { gate: "electro" }),
  s("electro-30", "face", E, "electro", "Electrolysis, 30 minutes", 30, 30.25, { gate: "electro" }),

  s("brow-shape", "eyes", B, "brows", "Eyebrow shape / wax", 15, 14.3),
  s("brow-tint", "eyes", B, "brows", "Eyebrow tint", 15, 14.3, { patch: true }),
  s("lash-tint", "eyes", B, "brows", "Eyelash tint", 30, 20.9, { patch: true }),
  s("brow-lam", "eyes", B, "brows", "Brow lamination", 45, 40, { patch: true }),
  s("lvl", "eyes", B, "lashes", "LVL Enhance", 60, 55, { note: "Includes eyelash tint", patch: true }),
  s("lvl-ultimate", "eyes", B, "lashes", "Ultimate LVL Lashes", 75, 62, { patch: true }),
  s("lash-classic", "eyes", B, "lashes", "Classic extensions", 120, 55, { patch: true }),
  s("lash-hybrid", "eyes", B, "lashes", "Hybrid lash extensions", 120, 65, { patch: true }),
  s("lash-russian", "eyes", B, "lashes", "Russian volume lashes", 180, 90, { patch: true }),
  s("lash-russian-off", "eyes", B, "lashes", "Russian lash removal", 15, 15),
  s("lash-off", "eyes", B, "lashes", "Lash removal", 15, 15),

  s("gel-mani", "hands", H, "nails", "Mii gel manicure", 75, 43.5, { note: "Buy 6, get the 7th free: £261" }),
  s("gel-fingers", "hands", H, "nails", "File and gel on fingers", 45, 32.5, { note: "Buy 6, get the 7th free: £195" }),
  s("mani", "hands", H, "nails", "Mii manicure", 45, 40, { note: "Buy 6, get the 7th free: £260" }),
  s("mani-deluxe", "hands", H, "nails", "Mii manicure deluxe", 60, 45),
  s("polish-fingers", "hands", H, "nails", "File and polish on fingers", 30, 23),
  s("cut-file", "hands", H, "nails", "Cut and file", 30, 23.5),
  s("gel-both", "hands", H, "nails", "Mii gel manicure and pedicure", 150, 87),
  s("mani-pedi", "hands", H, "nails", "Mii manicure and pedicure", 105, 72.5),
  s("soak-off", "hands", H, "nails", "Gel soak off", 15, 7.5, { ...est, note: "Gel applied by The Beauty Spot. £3.50 with a full manicure or pedicure" }),

  s("gel-pedi", "feet", P, "nails", "Mii gel pedicure", 75, 42.5, { note: "Buy 6, get the 7th free: £273" }),
  s("gel-toes", "feet", P, "nails", "File and gel on toes", 45, 32.5, { note: "Buy 6, get the 7th free: £195" }),
  s("pedi", "feet", P, "nails", "Mii pedicure", 60, 40, { note: "Buy 6, get the 7th free: £240" }),
  s("pedi-deluxe", "feet", P, "nails", "Mii pedicure deluxe", 90, 50),
  s("polish-toes", "feet", P, "nails", "File and polish on toes", 30, 23),

  s("aa-ultimate-60", "body", K, "massage", "Ultimate Aromatherapy Associates Experience, 60 min", 60, 63.2),
  s("aa-ultimate-90", "body", K, "massage", "Ultimate Aromatherapy Associates Experience, 90 min", 90, 88, { note: "Includes a facial" }),
  s("aa-muscle", "body", K, "massage", "Aromatherapy Associates Intensive Muscle Release", 60, 63.25),
  s("aa-destress", "body", K, "massage", "Aromatherapy Associates We De-Stress", 60, 63.25),
  s("aa-relax", "body", K, "massage", "Aromatherapy Associates We Relax", 60, 63.25),
  s("full-body", "body", K, "massage", "Full body massage", 60, 55),
  s("back-neck", "body", K, "massage", "Swedish back, neck and shoulder", 30, 38.5),
  s("stone-full", "body", K, "massage", "Deeper than Deep hot stone, full body", 60, 60.5),
  s("stone-back", "body", K, "massage", "Deeper than Deep hot stone, back", 30, 38.5),
  s("indian-head", "body", K, "massage", "Indian head massage", 45, 55),
  s("reflexology", "body", K, "massage", "Reflexology", 45, 55),
  s("scrub-massage", "body", K, "massage", "Full body scrub and massage", 90, 80),
  s("back-scrub-massage", "body", K, "massage", "Back massage and back scrub", 60, 60),
  s("body-scrub", "body", K, "massage", "Full body scrub", 60, 60),
  s("back-scrub", "body", K, "massage", "Back scrub", 30, 38, est),

  s("wax-half-leg", "body", W, "wax", "1/2 leg", 30, 25.85, { ...est, note: "Buy 6, get the 7th free: £155.10" }),
  s("wax-34-leg", "body", W, "wax", "3/4 leg", 45, 29.15, est),
  s("wax-full-leg", "body", W, "wax", "Full leg", 45, 32.73, est),
  s("wax-leg-bikini", "body", W, "wax", "Full leg and bikini line", 60, 42.9, est),
  s("wax-underarm", "body", W, "wax", "Underarm", 15, 17.6, { ...est, note: "Buy 6, get the 7th free: £105.60" }),
  s("wax-bikini", "body", W, "wax", "Bikini, just above underwear", 15, 20.35, { ...est, note: "Buy 6, get the 7th free: £122.10" }),
  s("wax-ext-bikini", "body", W, "wax", "Extended bikini line, strip or hot", 30, 21.45, est),
  s("wax-brazilian", "body", W, "wax", "Brazilian, hot wax", 30, 33, est),
  s("wax-hollywood", "body", W, "wax", "Hollywood, hot wax", 45, 38.5, est),
  s("wax-back", "body", W, "wax", "Back", 30, 30.8, est),
  s("wax-chest", "body", W, "wax", "Chest", 30, 29.15, est),
  s("wax-forearm", "body", W, "wax", "Forearm", 15, 18.7, est),
  s("wax-full-arm", "body", W, "wax", "Full arm", 30, 24.2, est),
  s("wax-chin", "body", W, "wax", "Chin", 15, 13.75, est),
  s("wax-lip", "body", W, "wax", "Lip", 15, 13.2, est),

  s("pkg-express", "packages", "Packages", "package", "Express Package", 120, 120, {
    note: "Express facial, express back and shoulder massage, mini mani and mini pedi",
  }),
  s("pkg-day", "packages", "Packages", "package", "A full day of treatments", 300, 205, {
    note: "Extended facial, full body massage, Mii manicure, Mii pedicure, eyelash tint and eyebrow shape. Lunch is included",
  }),
];

export const serviceById = new Map(services.map((x) => [x.id, x]));

export const servicesFor = (ids: string[]) =>
  ids.map((id) => serviceById.get(id)).filter((x): x is Service => Boolean(x));

export const gbp = (pence: number) =>
  pence === 0
    ? "Free"
    : new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
      }).format(pence / 100);

export const duration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

export const fromPrice = (region: RegionId) =>
  Math.min(
    ...services
      .filter((x) => x.region === region && x.pence > 0 && x.id !== "soak-off")
      .map((x) => x.pence),
  );

export const groupsIn = (region: RegionId) => [
  ...new Set(services.filter((x) => x.region === region).map((x) => x.group)),
];

export const gateInfo = {
  micro: { consultId: "micro-consult", label: "microneedling" },
  electro: { consultId: "electro-consult", label: "electrolysis" },
} as const;
