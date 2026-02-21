export interface Lineage {
  id: number;
  name: string;
  description: string | null;
  origin_story: string | null;
  origin_location: string | null;
  slug: string;
  privacy_level: number;
  avatar: string | null;
  cover: string | null;
  members_count: number;
  persons_count: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LineageFormPayload {
  name: string;
  description?: string;
  origin_story?: string;
  origin_location?: string;
  privacy_level?: number;
}
