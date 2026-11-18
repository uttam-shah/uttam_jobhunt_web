"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, Mail, SearchX, SlidersHorizontal, Sunrise, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emailJobs, getMeta, runSearch } from "@/lib/api";
import type { Criteria, Job, Meta, SearchResult, View } from "@/lib/types";
import { cn, dayLabel, save, store } from "@/lib/util";
import Counter from "./Counter";
import EmailModal from "./EmailModal";
import FilterPanel from "./FilterPanel";
import JobCard from "./JobCard";

const KEY = "jobhunt.criteria.v2";
const EMAIL_KEY = "jobhunt.email";
const PAGE = 30;
type Sort = "new" | "company" | "title";

const EMPTY: Criteria = { view: "24h", date: null, cities: [], experience: [], categories: [], query: "" };

export default function Dashboard() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [c, setC] = useState<Criteria>(EMPTY);
  const [res, setRes] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [shown, setShown] = useState(PAGE);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savedEmail, setSavedEmail] = useState("");
  const ready = useRef(false);

  // boot
  useEffect(() => {
    getMeta().then(setMeta).catch((e) => { setError(e.message); setLoading(false); });
    const saved = store<Criteria>(KEY, EMPTY);
    setC({ ...saved, view: saved.view === "date" && !saved.date ? "24h" : saved.view });
    setSavedEmail(store<{ v: string }>(EMAIL_KEY, { v: "" }).v);
    ready.current = true;
  }, []);

  // live search: whenever a filter changes (debounced; typing in the box doesn't spam)
  useEffect(() => {
    if (!ready.current || !meta) return;
    save(KEY, c);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const r = await runSearch(c, ctrl.signal);
        setRes(r); setShown(PAGE); setPicked(new Set());
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [c, meta]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const jobs = useMemo<Job[]>(() => {
    const list = [...(res?.jobs ?? [])];
    if (sort === "company") list.sort((a, b) => a.company.localeCompare(b.company));
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [res, sort]);

  const setView = (view: View, date: string | null = null) => setC({ ...c, view, date });
  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleCat = (name: string) =>
    setC({ ...c, categories: c.categories.includes(name) ? c.categories.filter((x) => x !== name) : [...c.categories, name] });

  async function sendEmail(email: string) {
    if (!res) return;
    const out = await emailJobs(res.search_id, email, picked.size ? [...picked] : undefined);
    save(EMAIL_KEY, { v: email }); setSavedEmail(email); setEmailOpen(false);
    setToast({ ok: true, msg: `Sent ${out.sent} job${out.sent === 1 ? "" : "s"} to ${out.to}` });
  }

  const counts = res?.counts ?? null;
  const tiles = counts ? Object.entries(counts.by_category).slice(0, 8) : [];
  const recent = meta?.days.slice(0, 7) ?? [];
  const noData = meta && !meta.last_update;
  const emailCount = picked.size || jobs.length;

  return (
    <div className="wrap">
      <div className="top">
        <div>
          <h1 className="display" style={{ fontSize: 30 }}>Delhi NCR <span className="grad-text">jobs</span></h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            Internships, freshers &amp; up to {meta?.max_experience_years ?? 2} years · every field · Delhi, Noida, Gurugram, Faridabad, Ghaziabad
          </p>
        </div>
        {meta?.last_update && (
          <div className="updated"><Sunrise size={16} />
            <div><b>Updated {meta.last_update.label}</b><span>Refreshes daily at {meta.run_at} IST</span></div>
          </div>
        )}
      </div>

      {/* ---- day picker */}
      <div className="datebar">
        <div className="seg day-seg">
          <button className={cn(c.view === "24h" && "on")} onClick={() => setView("24h")}><Clock size={14} /> Last 24 hours</button>
          <button className={cn(c.view === "yesterday" && "on")} onClick={() => setView("yesterday")}>Yesterday</button>
          <label className={cn("date-btn", c.view === "date" && "on")}>
            <CalendarDays size={14} />
            <input type="date" max={meta?.today} value={c.date ?? ""} aria-label="Pick a date"
              onChange={(e) => e.target.value && setView("date", e.target.value)} />
          </label>
        </div>
        <div className="chips days">
          {recent.map((d) => (
            <button key={d.date} className={cn("chip sm", c.view === "date" && c.date === d.date && "on")}
              onClick={() => setView("date", d.date)}>
              {dayLabel(d.date, meta!.today)}<span className="count">{d.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- numbers */}
      <div className="tiles">
        <div className="tile big">
          <span>{res?.view_label ?? "…"}</span>
          <b className="grad-text">{counts ? <Counter key={`${c.view}${c.date}${counts.total}`} to={counts.total} /> : "–"}</b>
          <span>new jobs posted</span>
        </div>
        {tiles.map(([name, n]) => (
          <motion.button key={name} className={cn("tile", c.categories.includes(name) && "on")} onClick={() => toggleCat(name)}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
            <span>{name}</span>
            <b><Counter key={`${name}${n}${c.view}${c.date}`} to={n} /></b>
          </motion.button>
        ))}
      </div>

      <div className="dash">
        {meta ? (
          <FilterPanel meta={meta} c={c} setC={setC} counts={counts} open={filtersOpen}
            onReset={() => setC({ ...EMPTY, view: c.view, date: c.date })} />
        ) : (
          <aside className="panel filters" style={{ display: "block" }}><div className="skel" style={{ height: 420 }} /></aside>
        )}

        <section>
          <div className="res-head">
            <div>
              <h2 className="display" style={{ fontSize: 22 }}>
                {res ? <>{res.matching} job{res.matching === 1 ? "" : "s"}{res.matching !== counts?.total && <span style={{ color: "var(--muted)", fontWeight: 500 }}> of {counts?.total}</span>}</> : "Jobs"}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 3 }}>{res?.view_label}</p>
            </div>
            <div className="res-actions">
              <button className="btn btn-ghost btn-sm mobile-filter-btn" onClick={() => setFiltersOpen((o) => !o)}>
                <SlidersHorizontal size={16} /> Filters
              </button>
              {jobs.length > 0 && (
                <>
                  <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
                    <option value="new">Newest first</option>
                    <option value="company">Company A–Z</option>
                    <option value="title">Title A–Z</option>
                  </select>
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    if (meta && !meta.email_enabled) setToast({ ok: false, msg: "Email isn't set up on the server yet (SMTP in .env)." });
                    else setEmailOpen(true);
                  }}>
                    <Mail size={16} /> {picked.size ? `Email ${picked.size} selected` : "Email all"}
                  </button>
                </>
              )}
            </div>
          </div>

          {error && <div className="err"><TriangleAlert size={16} style={{ verticalAlign: -3, marginRight: 8 }} />{error}</div>}

          {loading && !res ? (
            <div className="jobs">{[0, 1, 2, 3].map((i) => <div key={i} className="skel" style={{ animationDelay: `${i * .15}s` }} />)}</div>
          ) : noData ? (
            <div className="empty">
              <span className="ico"><Sunrise size={28} /></span>
              <h3>First update hasn&apos;t run yet</h3>
              <p>Jobs appear after the daily update (10:00 IST). To fill the board now, run <b>python -m jobhunt ingest --days 7</b> on the server.</p>
            </div>
          ) : res && jobs.length === 0 ? (
            <div className="empty">
              <span className="ico"><SearchX size={28} /></span>
              <h3>No jobs match</h3>
              <p>Nothing posted {res.view_label.toLowerCase()} with these filters. Try another day or clear some filters.</p>
            </div>
          ) : (
            <div className="jobs" style={{ opacity: loading ? 0.55 : 1, transition: "opacity .2s" }}>
              {jobs.slice(0, shown).map((j, i) => (
                <JobCard key={j.id} job={j} index={i} selected={picked.has(j.id)} onToggle={() => toggle(j.id)} />
              ))}
              {shown < jobs.length && (
                <button className="btn btn-ghost" onClick={() => setShown((s) => s + PAGE)}>Show more ({jobs.length - shown} left)</button>
              )}
            </div>
          )}
        </section>
      </div>

      {emailOpen && (
        <EmailModal open={emailOpen} count={emailCount} initial={savedEmail} onClose={() => setEmailOpen(false)} onSend={sendEmail} />
      )}
      <AnimatePresence>
        {toast && (
          <motion.div className={cn("toast", toast.ok ? "ok" : "bad")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {toast.ok ? <CheckCircle2 size={19} /> : <TriangleAlert size={19} />}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
