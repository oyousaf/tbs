import { serviceById, type Service } from "./menu";

/**
 * Plain keyword matching, not a language model. It maps everyday phrases to
 * real menu items and a preferred day and time, so it costs nothing to run and
 * can never invent a treatment.
 */
const rules: [RegExp, string[]][] = [
  [/\bgel(s)?\b.*\b(nails?|mani|hands?|fingers?)\b|\b(nails?|mani)\b.*\bgel(s)?\b/, ["gel-mani"]],
  [/\bgel(s)?\b.*\b(toes?|feet|foot|pedi)|\b(toes?|feet|foot|pedi)\w*\b.*\bgel(s)?\b/, ["gel-pedi"]],
  [/\bmani(cure)?\b|\bnails?\b/, ["mani"]],
  [/\bpedi(cure)?\b|\bfeet\b|\bfoot\b|\btoes?\b/, ["pedi"]],
  [/\bbrows?\b|\beyebrows?\b/, ["brow-shape"]],
  [/\blaminat/, ["brow-lam"]],
  [/\blvl\b|\blash lift\b/, ["lvl"]],
  [/\brussian\b|\bvolume\b/, ["lash-russian"]],
  [/\b(lashes|lash extensions?|extensions?)\b/, ["lash-classic"]],
  [/\b(tint)\b/, ["lash-tint"]],
  [/\b(tired|dull|glow|ageing|aging|wrinkle|lines?|firm|lift)\b/, ["hd-lift"]],
  [/\b(quick|short|lunch)\b.*\bfacial\b|\bfacial\b.*\b(quick|short|lunch)\b/, ["express-facial"]],
  [/\bfacial\b|\bskin\b/, ["extended-facial"]],
  [/\bmicro ?needling\b/, ["micro-consult"]],
  [/\belectrolysis\b|\bfacial hair\b/, ["electro-consult"]],
  [/\b(sore|tight|knot|knots|achy|aching|tense)\b|\bback\b|\bshoulders?\b|\bneck\b/, ["back-neck"]],
  [/\bstress|\bunwind|\brelax|\bcalm\b/, ["aa-destress"]],
  [/\bhot stones?\b/, ["stone-full"]],
  [/\bindian head\b/, ["indian-head"]],
  [/\breflexology\b/, ["reflexology"]],
  [/\bmassage\b/, ["full-body"]],
  [/\bbrazilian\b/, ["wax-brazilian"]],
  [/\bhollywood\b/, ["wax-hollywood"]],
  [/\bbikini\b/, ["wax-bikini"]],
  [/\bunder ?arms?\b/, ["wax-underarm"]],
  [/\blegs?\b|\bwax(ing)?\b/, ["wax-half-leg"]],
  [/\bpamper|\bfull day\b|\bwhole day\b|\bspa day\b|\btreat myself\b|\bbirthday\b/, ["pkg-day"]],
];

const days: [RegExp, number][] = [
  [/\btue(s|sday)?\b/, 2],
  [/\bwed(s|nesday)?\b/, 3],
  [/\bthu(r|rs|rsday)?\b/, 4],
  [/\bfri(day)?\b/, 5],
  [/\bsat(urday)?\b|\bweekend\b/, 6],
];

export type QuickResult = {
  services: Service[];
  day: number | null;
  part: "morning" | "afternoon" | "evening" | null;
};

export function quickFind(raw: string): QuickResult {
  const text = raw.toLowerCase();
  const ids: string[] = [];
  const covers = (id: string) =>
    (id === "mani" && ids.includes("gel-mani")) ||
    (id === "pedi" && ids.includes("gel-pedi")) ||
    (id === "full-body" && ids.some((x) => /aa-|back-neck|stone/.test(x))) ||
    (id === "extended-facial" && ids.some((x) => ["hd-lift", "express-facial"].includes(x))) ||
    (id === "lash-classic" && ids.includes("lash-russian"));
  for (const [re, found] of rules) {
    if (re.test(text)) for (const id of found) if (!ids.includes(id) && !covers(id)) ids.push(id);
  }
  const day = days.find(([re]) => re.test(text))?.[1] ?? null;
  const part = /\b(after work|evening|tonight|late)\b/.test(text)
    ? "evening"
    : /\b(lunch|afternoon)\b/.test(text)
      ? "afternoon"
      : /\b(morning|early|before work)\b/.test(text)
        ? "morning"
        : null;
  return {
    services: ids.slice(0, 4).map((id) => serviceById.get(id)).filter((x): x is Service => Boolean(x)),
    day,
    part,
  };
}
