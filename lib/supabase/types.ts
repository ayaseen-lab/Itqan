export type FamilyRole = "owner" | "parent" | "child" | "member";
export type CompetitionStatus = "open" | "active" | "completed" | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url: string | null;
  daily_goal: number;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string | null;
  display_name: string;
  role: FamilyRole;
  is_child: boolean;
  joined_at: string;
}

export interface ProgressDaily {
  id: string;
  user_id: string | null;
  member_id: string | null;
  day: string;
  verses_read: number;
  hifz_reviews: number;
  tests_completed: number;
  tasbih_count: number;
  xp: number;
  seconds_active: number;
  updated_at: string;
}

export interface Competition {
  id: string;
  name: string;
  invite_code: string;
  status: CompetitionStatus;
  created_by: string;
  host_family_id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface CompetitionFamily {
  id: string;
  competition_id: string;
  family_id: string;
  joined_at: string;
}

export interface FamilyScore {
  familyId: string;
  familyName: string;
  progressPoints: number;
  testsCompleted: number;
  totalScore: number;
}
