"use client";

import { createClient, isSupabaseConfigured } from "./client";
import { supabaseErrorMessage } from "./errors";
import type { Competition, CompetitionFamily, Family, FamilyScore, ProgressDaily } from "./types";
import { getMyFamily } from "./family";

function inviteCode(len = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function errMsg(err: unknown): string {
  return supabaseErrorMessage(err);
}

export type CompetitionBundle = {
  competition: Competition;
  families: Array<CompetitionFamily & { family: Family }>;
  scores: FamilyScore[];
};

export async function createCompetition(input: {
  name: string;
  days: number;
}): Promise<{ ok: true; competition: Competition } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const mine = await getMyFamily();
  if (!mine) return { ok: false, error: "Create or join a family first." };

  const role = mine.members.find((m) => m.user_id === user.id)?.role;
  if (role !== "owner" && role !== "parent") {
    return { ok: false, error: "Only parents/owners can start a competition." };
  }

  const ends = new Date();
  ends.setDate(ends.getDate() + Math.max(1, Math.min(30, input.days)));

  const { data: competition, error } = await supabase
    .from("competitions")
    .insert({
      name: input.name.trim(),
      invite_code: inviteCode(),
      created_by: user.id,
      host_family_id: mine.family.id,
      status: "open",
      ends_at: ends.toISOString(),
    })
    .select("*")
    .single();

  if (error || !competition) return { ok: false, error: errMsg(error) };

  await supabase.from("competition_families").insert({
    competition_id: competition.id,
    family_id: mine.family.id,
  });

  return { ok: true, competition: competition as Competition };
}

export async function joinCompetition(code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.rpc("join_competition_by_code", { code: code.trim().toUpperCase() });
  if (error) return { ok: false, error: errMsg(error) };
  return { ok: true };
}

async function scoreFamily(
  familyId: string,
  startsAt: string,
  endsAt: string,
): Promise<{ progressPoints: number; testsCompleted: number }> {
  const supabase = createClient();
  const startDay = startsAt.slice(0, 10);
  const endDay = endsAt.slice(0, 10);

  const { data: members } = await supabase
    .from("family_members")
    .select("id, user_id")
    .eq("family_id", familyId);

  const rows = (members ?? []) as Array<{ id: string; user_id: string | null }>;
  const userIds = rows.map((m) => m.user_id).filter(Boolean) as string[];
  const memberIds = rows.map((m) => m.id);

  const [byUser, byMember] = await Promise.all([
    userIds.length
      ? supabase
          .from("progress_daily")
          .select("*")
          .in("user_id", userIds)
          .gte("day", startDay)
          .lte("day", endDay)
      : Promise.resolve({ data: [] as ProgressDaily[] }),
    memberIds.length
      ? supabase
          .from("progress_daily")
          .select("*")
          .in("member_id", memberIds)
          .gte("day", startDay)
          .lte("day", endDay)
      : Promise.resolve({ data: [] as ProgressDaily[] }),
  ]);

  const seen = new Set<string>();
  let progressPoints = 0;
  let testsCompleted = 0;

  for (const row of [...(byUser.data ?? []), ...(byMember.data ?? [])] as ProgressDaily[]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    progressPoints +=
      row.verses_read +
      row.hifz_reviews * 2 +
      row.tasbih_count +
      row.xp +
      Math.floor((row.seconds_active ?? 0) / 60);
    testsCompleted += row.tests_completed;
  }

  return { progressPoints, testsCompleted };
}

export async function listMyCompetitions(): Promise<CompetitionBundle[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const mine = await getMyFamily();
  if (!mine) return [];

  const { data: links } = await supabase
    .from("competition_families")
    .select("competition_id")
    .eq("family_id", mine.family.id);

  const ids = [...new Set((links ?? []).map((l) => (l as { competition_id: string }).competition_id))];
  if (!ids.length) return [];

  const { data: competitions } = await supabase
    .from("competitions")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });

  const bundles: CompetitionBundle[] = [];

  for (const competition of (competitions ?? []) as Competition[]) {
    const { data: cf } = await supabase
      .from("competition_families")
      .select("*")
      .eq("competition_id", competition.id);

    const familyLinks = (cf ?? []) as CompetitionFamily[];
    const familyIds = familyLinks.map((f) => f.family_id);
    const { data: familyRows } = await supabase.from("families").select("*").in("id", familyIds);
    const familyMap = new Map((familyRows as Family[] | null)?.map((f) => [f.id, f]) ?? []);

    const families = familyLinks
      .map((link) => {
        const family = familyMap.get(link.family_id);
        if (!family) return null;
        return { ...link, family };
      })
      .filter(Boolean) as Array<CompetitionFamily & { family: Family }>;

    const scores: FamilyScore[] = [];
    for (const f of families) {
      const s = await scoreFamily(f.family_id, competition.starts_at, competition.ends_at);
      scores.push({
        familyId: f.family_id,
        familyName: f.family.name,
        progressPoints: s.progressPoints,
        testsCompleted: s.testsCompleted,
        totalScore: s.progressPoints + s.testsCompleted * 10,
      });
    }
    scores.sort((a, b) => b.totalScore - a.totalScore);

    bundles.push({ competition, families, scores });
  }

  return bundles;
}
