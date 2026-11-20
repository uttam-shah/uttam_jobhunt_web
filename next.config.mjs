/** @type {import('next').NextConfig} */
import path from "node:path";

const API_URL = process.env.API_URL || "https://api.uttamshah.in";//"http://127.0.0.1:8000";

export default {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  // The browser only ever talks to Next; Next forwards /api/* to the Python API.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};
