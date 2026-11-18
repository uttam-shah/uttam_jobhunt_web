"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Filter, MailCheck, MapPin, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMeta, runSearch } from "@/lib/api";
import { hue } from "@/lib/util";
import Counter from "./Counter";

const WORDS = ["Internships", "Fresher jobs", "0–2 year roles", "Sales & Accounts", "Tech & Data"];
const FALLBACK = ["Stripe", "Databricks", "MongoDB", "Okta", "GitLab", "Rubrik", "Paytm", "Meesho", "CRED", "Groww", "Zscaler", "Snowflake"];
const rise = (i = 0) => ({
  initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Home() {
  const [i, setI] = useState(0);
  const [companies, setCompanies] = useState<string[]>(FALLBACK);
  const [today, setToday] = useState<number | null>(null);
  const [top, setTop] = useState<[string, number][]>([]);
  const [runAt, setRunAt] = useState("10:00");

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    getMeta().then((m) => {
      if (m.companies.length) setCompanies(m.companies);
      setRunAt(m.run_at);
    }).catch(() => {});
    runSearch({ view: "24h", date: null, cities: [], experience: [], categories: [], query: "" })
      .then((r) => { setToday(r.counts.total); setTop(Object.entries(r.counts.by_category).slice(0, 4)); })
      .catch(() => {});
  }, []);

  const marquee = [...companies, ...companies];

  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <motion.span className="pill-tag" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <i className="pulse-dot" /> New jobs every morning at 10 AM
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }}>
            Fresh jobs in <br />
            <span className="rotor">
              <AnimatePresence mode="wait">
                <motion.span key={WORDS[i]} className="grad-text" style={{ display: "inline-block" }}
                  initial={{ opacity: 0, y: 30, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -30, rotateX: 60 }} transition={{ duration: 0.45 }}>
                  {WORDS[i]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br /> Delhi NCR.
          </motion.h1>
          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Only jobs posted in the last 24 hours — internships, freshers and up to 2 years of experience across
            Delhi, Noida, Gurugram, Faridabad and Ghaziabad. Sales, accounts, tech, data entry and more. No sign-up.
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Link href="/jobs" className="btn btn-primary btn-lg">See today&apos;s jobs <ArrowRight size={19} /></Link>
            <Link href="/jobs" className="btn btn-ghost btn-lg"><Filter size={18} /> Browse by field</Link>
          </motion.div>
        </div>

        <div className="stack" aria-hidden>
          {[
            { cls: "fc1", t: "Flutter Developer", c: "Paytm", l: "Noida", tag: "Fresher" },
            { cls: "fc2", t: "Business Development Executive", c: "Ixigo", l: "Gurugram", tag: "0–1 yrs" },
            { cls: "fc3", t: "Accounts Executive", c: "Freecharge", l: "Delhi", tag: "1–2 yrs" },
          ].map((x, k) => (
            <motion.div key={x.cls} className={`float-card ${x.cls}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + k * 0.18, duration: 0.7 }}>
              <div className="row">
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 17, background: `linear-gradient(135deg, hsl(${hue(x.c)} 80% 60%), hsl(${(hue(x.c) + 50) % 360} 80% 45%))` }}>{x.c[0]}</div>
                <div><h4>{x.t}</h4><small>{x.c}</small></div>
              </div>
              <div className="tags">
                <span className="tag loc"><MapPin size={12} />{x.l}</span>
                <span className="tag exp">{x.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section className="stats" {...rise()}>
        <div className="stat"><b className="grad-text">{today === null ? "–" : <Counter to={today} />}</b><span>Jobs posted in the last 24h</span></div>
        {top.length > 0
          ? top.slice(0, 2).map(([name, n]) => (
              <div className="stat" key={name}><b className="grad-text"><Counter to={n} /></b><span>{name}</span></div>))
          : <><div className="stat"><b className="grad-text">5</b><span>NCR cities</span></div><div className="stat"><b className="grad-text">20+</b><span>Fields covered</span></div></>}
        <div className="stat"><b className="grad-text"><Counter to={companies.length} /></b><span>Companies tracked</span></div>
      </motion.section>

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {marquee.map((n, k) => (
            <span key={k} className="co-chip">
              <span className="avatar" style={{ width: 26, height: 26, borderRadius: 8, fontSize: 12, background: `hsl(${hue(n)} 70% 52%)` }}>{n[0]}</span>{n}
            </span>
          ))}
        </div>
      </div>

      <section style={{ marginTop: 80 }}>
        <motion.h2 className="section-title" {...rise()}>How it works</motion.h2>
        <motion.p className="section-sub" {...rise(1)}>From &ldquo;what&apos;s new today?&rdquo; to applied.</motion.p>
        <div className="steps">
          {[
            { Icon: Filter, n: "01", t: "Updated at 10 AM", p: "Every morning we read each company's career page and keep what was posted in the last 24 hours." },
            { Icon: Search, n: "02", t: "Filter your way", p: "Pick a city, experience level and field. Switch to yesterday or any past date." },
            { Icon: MailCheck, n: "03", t: "Apply or email it", p: "Hit Apply to land on the company\'s own page, or email the shortlist to yourself." },
          ].map((s, k) => (
            <motion.div key={s.n} className="step" {...rise(k)}>
              <span className="ico"><s.Icon size={22} /></span>
              <div className="n" style={{ marginTop: 18 }}>{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section className="cta-band" {...rise()}>
        <h2>Your next role is <span className="grad-text">one click away</span></h2>
        <p>Fresh postings every morning, no account needed.</p>
        <Link href="/jobs" className="btn btn-primary btn-lg"><Zap size={18} /> Start searching</Link>
      </motion.section>

      <footer className="foot"><Building2 size={14} style={{ verticalAlign: -2, marginRight: 6 }} />Jobs are read from public company career pages, refreshed daily at {runAt} IST. Applications happen on the company&apos;s site.</footer>
    </div>
  );
}
