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
  created_at: string;
  updated_at: string;
}
