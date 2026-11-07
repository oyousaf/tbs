export const business = {
  name: "The Beauty Spot",
  legalName: "The Beauty Spot Sandy",
  url: "https://tbs.legxcysol.dev",
  phone: "01767 680766",
  phoneHref: "tel:+441767680766",
  street: "14a High Street",
  town: "Sandy",
  county: "Bedfordshire",
  postcode: "SG19 1AG",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=14a+High+Street+Sandy+Bedfordshire+SG19+1AG",
  facebook: "https://www.facebook.com/TheBeautySpotSandy/",
  instagram: "https://www.instagram.com/thebeautyspotsandy/",
  vouchers: "https://gift-cards.phorest.com/salons/thebeautyspotsandy",
};

/** Opening hours in minutes from midnight, indexed by JS weekday (0 = Sunday). */
export const hours: ([number, number] | null)[] = [
  null,
  null,
  [12 * 60, 21 * 60],
  [9 * 60, 18 * 60],
  [11 * 60, 21 * 60],
  [9 * 60, 17 * 60],
  [9 * 60, 16 * 60],
];

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Monday-first display order. */
export const weekOrder = [1, 2, 3, 4, 5, 6, 0];

export const navLinks = [
  { href: "/treatments", label: "Treatments" },
  { href: "/team", label: "Team" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gifts", label: "Gifts & points" },
  { href: "/visit", label: "Visit" },
];

export const footerLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/appointments", label: "My appointments" },
  { href: "/policies", label: "Policies" },
  { href: "/studio", label: "Salon diary" },
];
