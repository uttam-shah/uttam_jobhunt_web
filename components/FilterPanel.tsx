"use client";
import { Check, MapPin, RotateCcw, Search } from "lucide-react";
import type { Counts, Criteria, Meta } from "@/lib/types";
import { cn } from "@/lib/util";

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function FilterPanel({
  meta, c, setC, counts, onReset, open,
}: {
  meta: Meta; c: Criteria; setC: (c: Criteria) => void;
  counts: Counts | null; onReset: () => void; open: boolean;
}) {
  const set = (p: Partial<Criteria>) => setC({ ...c, ...p });
  const n = (map: Record<string, number> | undefined, k: string) => (map ? map[k] ?? 0 : null);
  const cats = [...meta.categories].sort((a, b) => (counts?.by_category[b] ?? 0) - (counts?.by_category[a] ?? 0));

  return (
    <aside className={cn("panel filters", open && "open")}>
      <div className="f-title">
        <h2>Filters</h2>
        <button className="link-btn" onClick={onReset}><RotateCcw size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Reset</button>
      </div>

      <div className="f-group">
        <div className="input-wrap">
          <Search size={16} />
          <input className="input" placeholder="Role, company or keyword…" value={c.query}
            onChange={(e) => set({ query: e.target.value })} />
        </div>
      </div>

      <div className="f-group">
        <div className="f-label">Experience {c.experience.length > 0 && <em>{c.experience.length} selected</em>}</div>
        {meta.experience.map((e) => {
          const on = c.experience.includes(e.id);
          return (
            <button key={e.id} className={cn("exp-opt", on && "on")} onClick={() => set({ experience: toggle(c.experience, e.id) })}>
              <span className={cn("check", on && "on")}><Check size={13} strokeWidth={3} /></span>
              <div style={{ flex: 1 }}><b>{e.label}</b><span>{e.hint}</span></div>
              {counts && <span className="count">{n(counts.by_experience, e.id)}</span>}
            </button>
          );
        })}
      </div>

      <div className="f-group">
        <div className="f-label"><span><MapPin size={12} style={{ verticalAlign: -1 }} /> City</span>{c.cities.length > 0 && <em>{c.cities.length} selected</em>}</div>
        <div className="chips">
          {meta.cities.map((city) => (
            <button key={city} className={cn("chip", c.cities.includes(city) && "on")} onClick={() => set({ cities: toggle(c.cities, city) })}>
              {city}{counts && <span className="count">{n(counts.by_city, city)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="f-group">
        <div className="f-label">Field {c.categories.length > 0 && <em>{c.categories.length} selected</em>}</div>
        <div className="chips">
          {cats.map((x) => (
            <button key={x} className={cn("chip sm", c.categories.includes(x) && "on", counts && !counts.by_category[x] && "zero")}
              onClick={() => set({ categories: toggle(c.categories, x) })}>
              {x}{counts && <span className="count">{n(counts.by_category, x)}</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
