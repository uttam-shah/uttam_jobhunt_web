import type { Criteria, Meta, SearchResult, Status } from "./types";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new Error("Can't reach the job finder API. Is the job finder server running?");
  }
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).detail;
    } catch {}
    // Next's proxy answers 500 with no JSON body when the Python API is down.
    throw new Error(detail || "The job finder API isn't responding. Is the job finder server running?");
  }
  return res.json();
}

export const getMeta = () => call<Meta>("/api/meta");

export const runSearch = (c: Criteria, signal?: AbortSignal) =>
  call<SearchResult>("/api/search", { method: "POST", body: JSON.stringify(c), signal });

export const emailJobs = (search_id: string, email: string, job_ids?: string[]) =>
  call<{ sent: number; to: string }>("/api/email", {
    method: "POST",
    body: JSON.stringify({ search_id, email, job_ids }),
  });

export const getStatus = () => call<Status>("/api/status");

export const startRefresh = () =>
  call<{ started: boolean; running: boolean }>("/api/refresh", { method: "POST" });
