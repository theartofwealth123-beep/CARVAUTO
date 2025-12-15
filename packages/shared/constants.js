export const TITLE_STATUS = {
  CLEAN: "CLEAN",
  RISK: "RISK",
  UNKNOWN: "UNKNOWN"
};

export const RISK_FLAG_TYPES = new Set([
  "SALVAGE",
  "REBUILT",
  "RECONSTRUCTED",
  "FLOOD",
  "TOTAL_LOSS",
  "NO_TITLE"
]);

export const RISK_KEYWORDS = [
  { type: "SALVAGE", patterns: ["salvage", "salvaged"] },
  { type: "REBUILT", patterns: ["rebuilt", "rebuild title", "rebuilt title"] },
  { type: "RECONSTRUCTED", patterns: ["reconstructed", "recon title"] },
  { type: "FLOOD", patterns: ["flood", "water damage", "flood damage"] },
  { type: "TOTAL_LOSS", patterns: ["total loss", "totaled"] },
  { type: "NO_TITLE", patterns: ["no title", "lost title", "bill of sale only"] },
  { type: "LIEN", patterns: ["lien", "bank owns", "payoff required"] },

  // Operational red flags (not necessarily title status)
  { type: "MECHANIC_SPECIAL", patterns: ["mechanic special", "needs work"] },
  { type: "TRANSMISSION", patterns: ["transmission", "slipping", "no reverse"] },
  { type: "OVERHEATING", patterns: ["overheating", "over heats"] },
  { type: "MISFIRE", patterns: ["misfire", "check engine"] }
];
