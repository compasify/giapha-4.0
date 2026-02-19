export type RelationshipType =
  | 'biological_parent' | 'adoptive_parent' | 'informal_adoptive' | 'step_parent'
  | 'foster_parent' | 'surrogate_parent' | 'godparent'
  | 'spouse_married' | 'spouse_divorced' | 'partner' | 'concubine'
  | 'sibling_full' | 'sibling_half' | 'sibling_step' | 'sibling_sworn'
  | 'guardian' | 'unknown';

export interface RelationshipPersonSummary {
  id: number;
  full_name: string;
  ho: string | null;
  ten_dem: string | null;
  ten: string;
  gender: string;
  is_alive: boolean;
  avatar: string | null;
  generation_number: number | null;
}

export interface Relationship {
  id: number;
  relationship_type: RelationshipType;
  notes: string | null;
  from_person: RelationshipPersonSummary;
  to_person: RelationshipPersonSummary;
}
