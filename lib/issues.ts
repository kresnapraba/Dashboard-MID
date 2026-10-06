import "server-only";
import { createClient } from "@supabase/supabase-js";

export type IssueSource = "HRMS" | "CRM" | "CCR";

type IssueRow = Record<string, unknown>;

export type IssueGroups = Record<Lowercase<IssueSource>, IssueRow[]>;

const sourceGroups: Record<IssueSource, Lowercase<IssueSource>> = {
  HRMS: "hrms",
  CRM: "crm",
  CCR: "ccr",
};

const allSources = Object.keys(sourceGroups) as IssueSource[];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Konfigurasi koneksi database Supabase belum tersedia.");
  }

  return createClient(url, key);
}

async function getIssuesBySource(source: IssueSource): Promise<IssueRow[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("b3_issue")
    .select(`
      id,
      ticket_code,
      reporter_department,
      title,
      employee_id,
      status,
      created_at,
      source
    `)
    .eq("source", source)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as IssueRow[];
}

export async function getIssues() {
  const bySource: IssueGroups = {
    hrms: [],
    crm: [],
    ccr: [],
  };

  const results = await Promise.allSettled(
    allSources.map(async (source) => {
      const rows = await getIssuesBySource(source);
      bySource[sourceGroups[source]] = rows;
    })
  );

  for (const result of results) {
    if (result.status === "rejected") {
      return {
        bySource: {
          hrms: [],
          crm: [],
          ccr: [],
        },
      };
    }
  }

  return {
    bySource,
  };
}