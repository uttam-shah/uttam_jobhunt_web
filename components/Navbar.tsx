"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar } from "lucide-react";
import { cn } from "@/lib/util";

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="logo">
          <span className="logo-mark"><Radar size={18} strokeWidth={2.5} /></span>
          Jobhunt
        </Link>
        <nav className="nav-links">
          <Link href="/" className={cn("nav-link", path === "/" && "on")}>Home</Link>
          <Link href="/jobs" className={cn("nav-link", path.startsWith("/jobs") && "on")}>Browse</Link>
          <Link href="/jobs" className="btn btn-primary btn-sm">Today's jobs</Link>
        </nav>
      </div>
    </header>
  );
}
