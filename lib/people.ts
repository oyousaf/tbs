import type { Skill } from "./menu";

export type Therapist = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  bookable: boolean;
  skills: Skill[];
  /** Sample rota: JS weekdays on shift. Replaced by the salon's real rota at go-live. */
  days: number[];
};

export const team: Therapist[] = [
  {
    id: "beverley",
    name: "Beverley",
    role: "Owner",
    image: "/images/beverley.webp",
    bio: "The owner, inspiration and driving force behind The Beauty Spot. Beverley believes we all deserve a little pampering from time to time.",
    bookable: false,
    skills: [],
    days: [],
  },
  {
    id: "clare",
    name: "Clare",
    role: "Therapist",
    image: "/images/clare.webp",
    bio: "NVQ level 2 and 3, with 20 years of therapy experience behind every facial, massage and set of nails.",
    bookable: true,
    skills: ["guinot", "facial", "micro", "electro", "brows", "lashes", "nails", "wax", "massage", "package"],
    days: [2, 3, 4, 5, 6],
  },
  {
    id: "ellie-mai",
    name: "Ellie-Mai",
    role: "Therapist",
    image: "/images/ellie-mai.webp",
    bio: "A receptionist turned therapist, NVQ level 2 qualified, and already the person many clients ask for by name.",
    bookable: true,
    skills: ["guinot", "facial", "brows", "lashes", "nails", "wax", "massage", "package"],
    days: [2, 4, 5, 6],
  },
  {
    id: "gracie",
    name: "Gracie",
    role: "Junior therapist",
    image: "/images/gracie.webp",
    bio: "Our junior therapist, working part-time while studying for her NVQ level 3.",
    bookable: true,
    skills: ["facial", "brows", "nails", "wax"],
    days: [3, 4, 6],
  },
];

export const therapists = team.filter((t) => t.bookable);
export const therapistById = new Map(team.map((t) => [t.id, t]));

export type Review = {
  name: string;
  date: string;
  therapist: "clare" | "ellie-mai" | "gracie";
  text: string;
};

/** Published on the salon's own reviews page, quoted as written. */
export const reviews: Review[] = [
  { name: "Clare", date: "2025-02-05", therapist: "ellie-mai", text: "Always a great and relaxing visit to The Beauty Spot and today was no different. I had a treatment that I have never had before but I was reassured and talked through the whole treatment. Thank you Ellie-Mai for your kindness and advice and of course for the wonderful relaxing Indian Head massage afterwards." },
  { name: "Diane", date: "2025-01-28", therapist: "clare", text: "I had an amazing facial in beautiful surroundings from the wonderful Clare. It was so relaxing and leaves my skin feeling great. Thank you Clare!" },
  { name: "Michelle", date: "2025-01-28", therapist: "gracie", text: "Had a fabulous pedicure by Gracie today, very pleased with my whole experience! Would definitely recommend her to anyone" },
  { name: "Christina", date: "2025-01-25", therapist: "ellie-mai", text: "Ellie-Mai was amazing. She spent so much time making sure my wax was perfect. She made me feel so comfortable throughout the process. It was the best wax experience I have had. Highly recommended her to anyone!" },
  { name: "Mira", date: "2025-02-13", therapist: "clare", text: "Clare takes so much trouble when doing my pedicure. My feet look so good at the end. It a good way to pamper youself" },
  { name: "Kelly", date: "2025-01-14", therapist: "gracie", text: "Gracie did a lovely job on my nails and she’s such a delight. Will definitely be going back to The Beauty Spot. Thankyou x" },
  { name: "Clare", date: "2024-12-14", therapist: "ellie-mai", text: "It’s always a pleasure to see Ellie-Mai. My brows always look perfect and it’s like catching up with a good friend. I wouldn’t go anywhere else to get my brows done. X" },
  { name: "Zoe", date: "2024-12-04", therapist: "clare", text: "I had the most heavenly relaxing massage from Clare, I felt like I was melting into the bed, I thoroughly enjoyed it. Thankyou so much." },
  { name: "Carol", date: "2024-12-14", therapist: "gracie", text: "Gracie was very professional and polite and friendly. It was a pleasure to have the pedicure by her. I have booked with her for a further treatment" },
  { name: "Barbara", date: "2024-12-04", therapist: "ellie-mai", text: "As usual it was a great experience. Ellie Mai is always welcoming and happy and after the session I feel totally relaxed. I have no hesitation in recommending the salon. I very much look forward to all my treatments with Ellie Mai and I am never disappointed." },
  { name: "Rachel", date: "2024-11-26", therapist: "clare", text: "Another great treatment with Clare. Would highly recommend the hot stone back massage. I feel so relaxed now. Thank you Clare." },
  { name: "Janet", date: "2024-11-06", therapist: "gracie", text: "Thoroughly enjoyed my manicure with Gracie. She is very competent and I am very pleased with my lovely nails." },
  { name: "Diane", date: "2024-10-01", therapist: "clare", text: "I had the We Inner Strength treatment and it was wonderful. It included an amazing back and shoulder massage as well as a cleansing facial and foot massage. Utter bliss, thank you Clare!" },
  { name: "Amelia", date: "2024-10-01", therapist: "ellie-mai", text: "Ellie was really friendly and I was greeted with a huge smile! She made me feel like I had been there already and that it wasn’t my first time. She has done my eyebrows perfectly and I can’t wait to go back. Thank you! x" },
  { name: "Faye", date: "2025-01-25", therapist: "gracie", text: "Gracie did an amazing job with my gels today, they’re so neat. Thanks Gracie will book again" },
  { name: "Paula", date: "2024-04-16", therapist: "ellie-mai", text: "I love my treatments with Ellie-Mai. She’s a fantastic, talented beautician with such a professional manner. I’ve booked quite a few treatments in advance for this reason as she’s very busy." },
  { name: "Sharon", date: "2024-04-16", therapist: "clare", text: "Haven’t been for a while but great to be back, Clare is lovely and easy to talk to as well as being an excellent beautician, all round lovely experience." },
  { name: "Julie", date: "2025-02-05", therapist: "gracie", text: "Gracie was attentive to my nail requirements and was very pleasant to talk to" },
];

export const gallery: { src: string; alt: string; w: number; h: number }[] = [
  { src: "/images/room.webp", alt: "A treatment room with a couch dressed in plum towels", w: 800, h: 1200 },
  { src: "/images/facial.webp", alt: "A therapist giving a client a Guinot facial", w: 1600, h: 1067 },
  { src: "/images/lounge.webp", alt: "The salon's waiting area with grey armchairs and flowers", w: 1600, h: 1067 },
  { src: "/images/brushes.webp", alt: "Make-up brushes in soft focus", w: 1600, h: 1067 },
  { src: "/images/reception.webp", alt: "The curved reception desk with white roses", w: 800, h: 1200 },
  { src: "/images/aroma-oils.webp", alt: "A row of Aromatherapy Associates body oils on a wooden shelf", w: 1600, h: 1067 },
  { src: "/images/massage.webp", alt: "A therapist's hands massaging a client's back", w: 800, h: 1200 },
  { src: "/images/polish.webp", alt: "Bottles of nail polish on a white shelf with flowers", w: 1600, h: 1067 },
  { src: "/images/towels.webp", alt: "A stack of embroidered salon towels", w: 1600, h: 1067 },
  { src: "/images/roses.webp", alt: "A vase of cream roses in the waiting area", w: 800, h: 1200 },
  { src: "/images/delilah.webp", alt: "Delilah cosmetics in pink boxes", w: 1600, h: 1067 },
  { src: "/images/aroma-bath.webp", alt: "Aromatherapy Associates bath oils on a glass shelf", w: 1600, h: 1067 },
  { src: "/images/shopfront.webp", alt: "The salon's High Street shopfront window", w: 800, h: 1200 },
  { src: "/images/lounge-table.webp", alt: "A glass table of skincare between two armchairs", w: 1600, h: 1067 },
  { src: "/images/electrolysis.webp", alt: "The salon's Sylvia Lewis electrolysis machine", w: 1600, h: 1067 },
  { src: "/images/aroma-boxes.webp", alt: "Boxed Aromatherapy Associates bath and shower oils", w: 800, h: 1200 },
  { src: "/images/tan-range.webp", alt: "A shelf of tanning products", w: 1600, h: 1067 },
  { src: "/images/bag.webp", alt: "A metallic cosmetics bag on display", w: 1600, h: 1067 },
];
