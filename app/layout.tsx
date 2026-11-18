import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Jobhunt — Fresh jobs in Delhi NCR",
  description: "Jobs posted in the last 24 hours in Delhi NCR — internships, freshers and up to 2 years, every field. Updated daily at 10 AM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Aurora />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
