"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Building2, Check, Clock, MapPin, Layers } from "lucide-react";
import type { Job } from "@/lib/types";
import { ago, cn, hue } from "@/lib/util";

export default function JobCard({
  job, index, selected, onToggle,
}: { job: Job; index: number; selected: boolean; onToggle: () => void }) {
  const h = hue(job.company);
  const fresh = job.hours_ago < 6;
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.045, ease: [0.22, 1, 0.36, 1] }}
      className={cn("job", selected && "sel")}
    >
      <div className="avatar" style={{ background: `linear-gradient(135deg, hsl(${h} 80% 60%), hsl(${(h + 50) % 360} 80% 45%))` }}>
        {job.company[0]}
      </div>
      <div style={{ minWidth: 0 }}>
        <h3>{job.title}</h3>
        <div className="co"><Building2 size={13} style={{ verticalAlign: -2, marginRight: 5 }} />{job.company}</div>
        <div className="tags">
          <span className="tag loc"><MapPin size={12} />{job.cities.join(" · ") || job.location}</span>
          <span className="tag exp"><Briefcase size={12} />{job.experience_label}</span>
          <span className="tag cat"><Layers size={12} />{job.category}</span>
          {fresh && <span className="tag new">NEW</span>}
        </div>
        {job.snippet && <p className="snip">{job.snippet}</p>}
      </div>
      <div className="job-side">
        <span className="posted"><Clock size={13} />{ago(job.hours_ago)}</span>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Apply <ArrowUpRight size={16} />
        </a>
      </div>
      <button className={cn("check pick", selected && "on")} onClick={onToggle} aria-label="Select for email" title="Select to email" style={{ position: "absolute" }}>
        <Check size={13} strokeWidth={3} />
      </button>
    </motion.article>
  );
}
