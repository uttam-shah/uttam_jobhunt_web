export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  cities: string[];
  url: string;
  posted_at: string;
  posted_date: string;
  hours_ago: number;
  experience_levels: string[];
  experience_label: string;
  category: string;
  salary: string | null;
  ats: string;
  snippet: string;
};

export type LastUpdate = { at: string; label: string; kept: number; new: number; boards: number } | null;

export type Meta = {
  cities: string[];
  categories: string[];
  experience: { id: string; label: string; hint: string }[];
  max_experience_years: number;
  company_count: number;
  companies: string[];
  run_at: string;
  timezone: string;
  email_enabled: boolean;
  last_update: LastUpdate;
  days: { date: string; n: number }[];
  today: string;
};

export type Counts = {
  total: number;
  by_category: Record<string, number>;
  by_city: Record<string, number>;
  by_experience: Record<string, number>;
};

export type View = "24h" | "yesterday" | "date";

export type SearchResult = {
  jobs: Job[];
  matching: number;
  counts: Counts;
  view_label: string;
  search_id: string;
  last_update: LastUpdate;
};

export type Criteria = {
  view: View;
  date: string | null;
  cities: string[];
  experience: string[];
  categories: string[];
  query: string;
};
