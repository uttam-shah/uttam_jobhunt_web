export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

export function ago(hours: number): string {
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const d = Math.floor(hours / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export function dayLabel(iso: string, today: string): string {
  const d = new Date(iso + "T00:00:00");
  const diff = Math.round((new Date(today + "T00:00:00").getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

const HUES = [255, 200, 160, 20, 330, 45, 280, 180];
export function hue(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return HUES[h % HUES.length];
}

export function store<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
