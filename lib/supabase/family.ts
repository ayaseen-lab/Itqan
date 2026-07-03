"use client";

import { createClient, isSupabaseConfigured } from "./client";
import { isSchemaMissingError, supabaseErrorMessage } from "./errors";
import type { Family, FamilyMember, ProgressDaily } from "./types";

export type FamilyBundle = {
  family: Family;
  members: FamilyMember[];
  progress: ProgressDaily[];
};

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

async function ensureProfile(userId: string, email: string, fullName: string) {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName || email.split("@")[0] || "User",
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function getMyFamily(): Promise<FamilyBundle | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership, error: memLookupErr } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (memLookupErr) {
    if (isSchemaMissingError(memLookupErr)) throw memLookupErr;
    return null;
  }

  if (!membership) return null;

  const familyId = membership.family_id as string;

  const [{ data: family }, { data: members }] = await Promise.all([
    supabase.from("families").select("*").eq("id", familyId).single(),
    supabase.from("family_members").select("*").eq("family_id", familyId).order("joined_at"),
  ]);

  if (!family) return null;

  const memberRows = (members ?? []) as FamilyMember[];
  const userIds = memberRows.map((m) => m.user_id).filter(Boolean) as string[];
  const memberIds = memberRows.map((m) => m.id);

  const since = new Date();
  since.setDate(since.getDate() - 14);
  const sinceDay = since.toISOString().slice(0, 10);

  let progress: ProgressDaily[] = [];
  if (userIds.length || memberIds.length) {
    let q = supabase.from("progress_daily").select("*").gte("day", sinceDay);
    // Fetch by user_id or member_id in two queries and merge
    const [byUser, byMember] = await Promise.all([
      userIds.length
        ? supabase.from("progress_daily").select("*").in("user_id", userIds).gte("day", sinceDay)
        : Promise.resolve({ data: [] as ProgressDaily[] }),
      memberIds.length
        ? supabase.from("progress_daily").select("*").in("member_id", memberIds).gte("day", sinceDay)
        : Promise.resolve({ data: [] as ProgressDaily[] }),
    ]);
    const map = new Map<string, ProgressDaily>();
    for (const row of [...(byUser.data ?? []), ...(byMember.data ?? [])] as ProgressDaily[]) {
      map.set(row.id, row);
    }
    progress = [...map.values()];
    void q;
  }

  return {
    family: family as Family,
    members: memberRows,
    progress,
  };
}

export async function createFamily(name: string): Promise<{ ok: true; family: Family } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  try {
    const existing = await getMyFamily();
    if (existing) return { ok: false, error: "You already belong to a family." };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Parent";

  try {
    await ensureProfile(user.id, user.email ?? "", displayName);
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }

  const code = inviteCode();

  const { data: family, error } = await supabase
    .from("families")
    .insert({ name: name.trim(), invite_code: code, created_by: user.id })
    .select("*")
    .single();

  if (error || !family) return { ok: false, error: errMsg(error) };

  const { error: memErr } = await supabase.from("family_members").insert({
    family_id: family.id,
    user_id: user.id,
    display_name: displayName,
    role: "owner",
    is_child: false,
  });

  if (memErr) return { ok: false, error: errMsg(memErr) };
  return { ok: true, family: family as Family };
}

export async function joinFamily(
  code: string,
  opts?: { asChild?: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.rpc("join_family_by_code", {
    code: code.trim().toUpperCase(),
    as_child: Boolean(opts?.asChild),
  });
  if (error) return { ok: false, error: errMsg(error) };
  return { ok: true };
}

export async function addChildMember(
  familyId: string,
  displayName: string,
): Promise<{ ok: true; member: FamilyMember } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { data, error } = await supabase
    .from("family_members")
    .insert({
      family_id: familyId,
      user_id: null,
      display_name: displayName.trim(),
      role: "child",
      is_child: true,
    })
    .select("*")
    .single();

  if (error || !data) return { ok: false, error: errMsg(error) };
  return { ok: true, member: data as FamilyMember };
}

export async function removeMember(memberId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const { error } = await supabase.from("family_members").delete().eq("id", memberId);
  if (error) return { ok: false, error: errMsg(error) };
  return { ok: true };
}

export async function logChildProgress(
  memberId: string,
  patch: Partial<Pick<ProgressDaily, "verses_read" | "hifz_reviews" | "tests_completed" | "tasbih_count" | "xp">>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase is not configured." };
  const supabase = createClient();
  const day = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("progress_daily")
    .select("*")
    .eq("member_id", memberId)
    .eq("day", day)
    .maybeSingle();

  if (existing) {
    const row = existing as ProgressDaily;
    const { error } = await supabase
      .from("progress_daily")
      .update({
        verses_read: row.verses_read + (patch.verses_read ?? 0),
        hifz_reviews: row.hifz_reviews + (patch.hifz_reviews ?? 0),
        tests_completed: row.tests_completed + (patch.tests_completed ?? 0),
        tasbih_count: row.tasbih_count + (patch.tasbih_count ?? 0),
        xp: row.xp + (patch.xp ?? 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) return { ok: false, error: errMsg(error) };
  } else {
    const { error } = await supabase.from("progress_daily").insert({
      member_id: memberId,
      day,
      verses_read: patch.verses_read ?? 0,
      hifz_reviews: patch.hifz_reviews ?? 0,
      tests_completed: patch.tests_completed ?? 0,
      tasbih_count: patch.tasbih_count ?? 0,
      xp: patch.xp ?? 0,
    });
    if (error) return { ok: false, error: errMsg(error) };
  }

  return { ok: true };
}

export function memberTotals(progress: ProgressDaily[], member: FamilyMember) {
  const rows = progress.filter(
    (p) =>
      (member.user_id && p.user_id === member.user_id) ||
      p.member_id === member.id,
  );
  return rows.reduce(
    (acc, r) => ({
      verses: acc.verses + r.verses_read,
      hifz: acc.hifz + r.hifz_reviews,
      tests: acc.tests + r.tests_completed,
      tasbih: acc.tasbih + r.tasbih_count,
      xp: acc.xp + r.xp,
      seconds: acc.seconds + (r.seconds_active ?? 0),
    }),
    { verses: 0, hifz: 0, tests: 0, tasbih: 0, xp: 0, seconds: 0 },
  );
}
