"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, Send, X } from "lucide-react";
import { useState } from "react";

export default function EmailModal({
  open, count, initial, onClose, onSend,
}: {
  open: boolean; count: number; initial: string;
  onClose: () => void; onSend: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    try { await onSend(email.trim()); }
    catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form
            className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="ico"><Mail size={22} /></span>
              <button type="button" className="link-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>
            <h3>Email me these jobs</h3>
            <p>We&apos;ll send {count} job{count === 1 ? "" : "s"} with direct apply links to your inbox.</p>
            <input className="input plain" type="email" required autoFocus placeholder="you@gmail.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            {err && <div className="err" style={{ marginTop: 12, marginBottom: 0 }}>{err}</div>}
            <div className="row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={busy || !email}>
                {busy ? <Loader2 size={18} className="spin-ico" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={17} />}
                {busy ? "Sending…" : "Send"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
