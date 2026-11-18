"use client";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => Math.round(n).toLocaleString("en-IN") + suffix);
  useEffect(() => {
    if (inView) animate(v, to, { duration: 1.6, ease: "easeOut" });
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}
