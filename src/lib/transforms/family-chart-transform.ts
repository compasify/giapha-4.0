/**
 * Transform Rails API data (persons + relationships) into family-chart Datum[] format.
 *
 * family-chart requires:
 *   - id: string
 *   - data.gender: 'M' | 'F'
 *   - rels.parents / rels.spouses / rels.children — all string[]
 */

import { Person } from '@/types/person';
import { Relationship, RelationshipType } from '@/types/relationship';

// ── Types ────────────────────────────────────────────────────────────────────

/** Custom fields stored in Datum.data alongside gender */
export interface FamilyChartPersonData {
  gender: 'M' | 'F';
  ho: string | null;
  ten_dem: string | null;
  ten: string;
  full_name: string;
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  birth_date_id: number | null;
  death_year: number | null;
  death_month: number | null;
  death_day: number | null;
  death_date_id: number | null;
  is_alive: boolean;
  generation_number: number | null;
  avatar: string | null;
  biography: string | null;
  notes: string | null;
  birth_place: string | null;
  death_place: string | null;
}

/** family-chart Datum */
export interface FamilyChartDatum {
  id: string;
  data: FamilyChartPersonData;
  rels: {
    parents: string[];
    spouses: string[];
    children: string[];
  };
}

// ── Relationship type groupings ───────────────────────────────────────────────

const PARENT_TYPES = new Set<RelationshipType>([
  'biological_parent',
  'adoptive_parent',
  'informal_adoptive',
  'step_parent',
  'foster_parent',
  'surrogate_parent',
  'godparent',
]);

const SPOUSE_TYPES = new Set<RelationshipType>([
  'spouse_married',
  'spouse_divorced',
  'partner',
  'concubine',
]);

// ── Helpers ───────────────────────────────────────────────────────────────────

function toGender(gender: Person['gender']): 'M' | 'F' {
  return gender === 'female' ? 'F' : 'M';
}

function buildDatum(person: Person): FamilyChartDatum {
  const bd = person.birth_date;
  const dd = person.death_date;
  return {
    id: String(person.id),
    data: {
      gender: toGender(person.gender),
      ho: person.ho,
      ten_dem: person.ten_dem,
      ten: person.ten,
      full_name: person.full_name,
      birth_year: bd?.solar_year ?? null,
      birth_month: bd?.solar_month ?? null,
      birth_day: bd?.solar_day ?? null,
      birth_date_id: bd?.id ?? null,
      death_year: dd?.solar_year ?? null,
      death_month: dd?.solar_month ?? null,
      death_day: dd?.solar_day ?? null,
      death_date_id: dd?.id ?? null,
      is_alive: person.is_alive,
      generation_number: person.generation_number,
      avatar: person.avatar,
      biography: person.biography,
      notes: person.notes,
      birth_place: person.birth_place,
      death_place: person.death_place,
    },
    rels: {
      parents: [],
      spouses: [],
      children: [],
    },
  };
}

// ── Main transform ────────────────────────────────────────────────────────────

/**
 * Transform persons + relationships into family-chart Datum[].
 *
 * Relationship semantics (from Rails):
 *   - PARENT types: from_person IS PARENT of to_person
 *       → to_person.rels.parents.push(from_person.id)
 *       → from_person.rels.children.push(to_person.id)
 *   - SPOUSE types: from_person and to_person are spouses (bidirectional)
 *       → from_person.rels.spouses.push(to_person.id)
 *       → to_person.rels.spouses.push(from_person.id)
 */
export type LinkCategory = 'biological' | 'adoptive' | 'step' | 'sworn' | 'spouse' | 'other';

export interface TransformResult {
  data: FamilyChartDatum[];
  linkMap: Map<string, LinkCategory>;
}

function toLinkCategory(type: RelationshipType): LinkCategory {
  if (type === 'biological_parent') return 'biological';
  if (type === 'adoptive_parent' || type === 'informal_adoptive' || type === 'foster_parent') return 'adoptive';
  if (type === 'step_parent') return 'step';
  if (type === 'godparent' || type === 'surrogate_parent') return 'sworn';
  if (SPOUSE_TYPES.has(type)) return 'spouse';
  return 'other';
}

function linkKey(a: string, b: string): string {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

export function transformToFamilyChart(
  persons: Person[],
  relationships: Relationship[]
): TransformResult {
  const map = new Map<string, FamilyChartDatum>();
  for (const p of persons) {
    map.set(String(p.id), buildDatum(p));
  }

  const linkMap = new Map<string, LinkCategory>();

  for (const rel of relationships) {
    const fromId = String(rel.from_person.id);
    const toId = String(rel.to_person.id);
    const fromDatum = map.get(fromId);
    const toDatum = map.get(toId);

    if (!fromDatum || !toDatum) continue;

    linkMap.set(linkKey(fromId, toId), toLinkCategory(rel.relationship_type));

    if (PARENT_TYPES.has(rel.relationship_type)) {
      if (!toDatum.rels.parents.includes(fromId)) {
        toDatum.rels.parents.push(fromId);
      }
      if (!fromDatum.rels.children.includes(toId)) {
        fromDatum.rels.children.push(toId);
      }
    } else if (SPOUSE_TYPES.has(rel.relationship_type)) {
      if (!fromDatum.rels.spouses.includes(toId)) {
        fromDatum.rels.spouses.push(toId);
      }
      if (!toDatum.rels.spouses.includes(fromId)) {
        toDatum.rels.spouses.push(fromId);
      }
    }
  }

  return { data: Array.from(map.values()), linkMap };
}
