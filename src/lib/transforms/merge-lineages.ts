/**
 * Merge multiple lineages into a single FamilyChartDatum[] for combined view.
 * Handles ID namespacing, person deduplication via mappings, and color assignment.
 */

import type {
  FamilyChartDatum,
  FamilyChartPersonData,
  TransformResult,
  LinkCategory,
  RelationshipInfo,
} from './family-chart-transform';
import type { PersonMappings } from './person-matching';
import { makeNamespacedId } from './person-matching';

// ── Types ────────────────────────────────────────────────────────────────────

export interface LineageSource {
  lineageId: number;
  lineageName: string;
  color: string;
  result: TransformResult;
}

export interface MergeOptions {
  personMappings: PersonMappings;
}

export interface MergedDatumData extends FamilyChartPersonData {
  lineage_color?: string;
  lineage_badge?: string;
  is_external?: boolean;
}

export interface MergedTransformResult {
  data: FamilyChartDatum[];
  linkMap: Map<string, LinkCategory>;
  relationshipMap: Map<string, RelationshipInfo[]>;
  lineageColorMap: Map<string, string>;
  lineageBadgeMap: Map<string, string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeLineageBadge(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Remap a single ID through the namespace + mappings */
function remapId(
  originalId: string,
  lineageId: number,
  mappings: PersonMappings,
): string {
  const nsId = makeNamespacedId(lineageId, Number(originalId));
  const mapped = mappings[nsId];
  if (mapped && mapped !== 'new' && mapped !== 'skip') return mapped;
  return nsId;
}

/** Namespace a datum: remap its own ID and all relationship IDs */
function namespaceDatum(
  datum: FamilyChartDatum,
  lineageId: number,
  color: string,
  badge: string,
  mappings: PersonMappings,
  isPrimary: boolean,
): FamilyChartDatum {
  const nsId = remapId(datum.id, lineageId, mappings);

  return {
    id: nsId,
    data: {
      ...datum.data,
      lineage_color: color,
      lineage_badge: badge,
      is_external: !isPrimary,
    } as MergedDatumData,
    rels: {
      parents: datum.rels.parents.map((id) => remapId(id, lineageId, mappings)),
      spouses: datum.rels.spouses.map((id) => remapId(id, lineageId, mappings)),
      children: datum.rels.children.map((id) => remapId(id, lineageId, mappings)),
    },
  };
}

// ── Main merge ───────────────────────────────────────────────────────────────

export function mergeLineages(
  sources: LineageSource[],
  options: MergeOptions,
): MergedTransformResult {
  const { personMappings } = options;
  const mergedMap = new Map<string, FamilyChartDatum>();
  const linkMap = new Map<string, LinkCategory>();
  const relationshipMap = new Map<string, RelationshipInfo[]>();
  const lineageColorMap = new Map<string, string>();
  const lineageBadgeMap = new Map<string, string>();

  // Track which nsIds are 'skip' (duplicate mapped to a canonical)
  const skipIds = new Set<string>();
  for (const [nsId, target] of Object.entries(personMappings)) {
    if (target !== 'new' && target !== 'skip' && target !== nsId) {
      skipIds.add(nsId);
    }
    if (target === 'skip') {
      skipIds.add(nsId);
    }
  }

  for (let i = 0; i < sources.length; i++) {
    const { lineageId, lineageName, color, result } = sources[i];
    const badge = makeLineageBadge(lineageName);
    const isPrimary = i === 0;

    for (const datum of result.data) {
      const nsDatum = namespaceDatum(datum, lineageId, color, badge, personMappings, isPrimary);
      const nsId = makeNamespacedId(lineageId, Number(datum.id));

      // Skip if this person is mapped to a canonical from another lineage
      if (skipIds.has(nsId)) {
        // But merge its relationships into the canonical datum
        const canonical = mergedMap.get(nsDatum.id);
        if (canonical) {
          mergeRels(canonical, nsDatum);
        }
        continue;
      }

      // If already in map (canonical added by primary), merge rels
      if (mergedMap.has(nsDatum.id)) {
        mergeRels(mergedMap.get(nsDatum.id)!, nsDatum);
      } else {
        mergedMap.set(nsDatum.id, nsDatum);
      }

      lineageColorMap.set(nsDatum.id, color);
      lineageBadgeMap.set(nsDatum.id, badge);
    }

    // Merge linkMaps
    for (const [key, cat] of result.linkMap) {
      linkMap.set(key, cat);
    }
  }

  return {
    data: Array.from(mergedMap.values()),
    linkMap,
    relationshipMap,
    lineageColorMap,
    lineageBadgeMap,
  };
}

/** Merge relationship arrays from duplicate into canonical (no duplicates) */
function mergeRels(canonical: FamilyChartDatum, duplicate: FamilyChartDatum): void {
  for (const parentId of duplicate.rels.parents) {
    if (!canonical.rels.parents.includes(parentId)) {
      canonical.rels.parents.push(parentId);
    }
  }
  for (const spouseId of duplicate.rels.spouses) {
    if (!canonical.rels.spouses.includes(spouseId)) {
      canonical.rels.spouses.push(spouseId);
    }
  }
  for (const childId of duplicate.rels.children) {
    if (!canonical.rels.children.includes(childId)) {
      canonical.rels.children.push(childId);
    }
  }
}