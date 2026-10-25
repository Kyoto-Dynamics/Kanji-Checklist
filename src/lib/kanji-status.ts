// The four colours a kanji can have. "unlearnt" (grey) is never stored in the
// database: it is the default when a user has no row for a kanji.
export type KanjiStatus = "unlearnt" | "learning" | "struggling" | "learnt";

// Tapping a tile moves to the next status in this order, then wraps around.
export const statusOrder: KanjiStatus[] = ["unlearnt", "learning", "struggling", "learnt"];

export function nextStatus(status: KanjiStatus): KanjiStatus {
  return statusOrder[(statusOrder.indexOf(status) + 1) % statusOrder.length];
}

// The symbol is shown alongside the colour so colour is never the only signal.
export const statusInfo: Record<KanjiStatus, { label: string; symbol: string; className: string }> = {
  unlearnt: { label: "Not started", symbol: "○", className: "bg-zinc-100 text-zinc-800 border-zinc-300" },
  learning: { label: "Learning", symbol: "…", className: "bg-yellow-200 text-yellow-950 border-yellow-500" },
  struggling: { label: "Struggling", symbol: "!", className: "bg-red-200 text-red-950 border-red-500" },
  learnt: { label: "Learnt", symbol: "✓", className: "bg-green-200 text-green-950 border-green-600" },
};
