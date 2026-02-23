/**
 * Fuzzy person matching engine for cross-lineage comparison.
 * Pure frontend utility — no backend dependency.
 *
 * Score formula: 0.6 * nameScore + 0.3 * birthYearMatch + 0.1 * genderMatch
 */

import type { Person } from '@/types/person';

// ── Types ────────────────────────────────────────────────────────────────────

export interface PersonMatchCandidate {
  person: Person;
  lineageId: number;
  namespacedId: string; // "{lineageId}_{personId}"
}

export interface MatchResult {
  sourceId: string; // namespaced
  targetId: string; // namespaced
  confidence: number; // 0–1
  matchedFields: ('name' | 'birth_year' | 'gender')[];
}

export interface PersonMappings {
  [sourceId: string]: string | 'new' | 'skip';
}

// ── Vietnamese name normalization ─────────────────────────────────────────────

const DIACRITICS_MAP: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

/** Normalize Vietnamese name: NFD decompose → remove diacritics → lowercase → trim */
export function normalizeVietnameseName(name: string): string {
  return name
    .normalize('NFD')
    .toLowerCase()
    .split('')
    .map((ch) => DIACRITICS_MAP[ch] ?? ch)
    .join('')
    .replace(/[\u0300-\u036f]/g, '') // strip remaining combining marks
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Scoring helpers ──────────────────────────────────────────────────────────

/**
 * Simple normalized Levenshtein-based similarity score (0–1).
 * Optimized for short Vietnamese names (typically 2–4 syllables).
 */
function nameSimilarity(a: string, b: string): number {
  const normA = normalizeVietnameseName(a);
  const normB = normalizeVietnameseName(b);

  if (normA === normB) return 1.0;
  if (normA.length === 0 || normB.length === 0) return 0;

  const maxLen = Math.max(normA.length, normB.length);
  const dist = levenshteinDistance(normA, normB);
  return 1 - dist / maxLen;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[]);

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[m][n];
}

function birthYearScore(a: Person, b: Person): number {
  const yearA = a.birth_date?.solar_year ?? a.birth_date?.lunar_year;
  const yearB = b.birth_date?.solar_year ?? b.birth_date?.lunar_year;

  if (yearA == null || yearB == null) return 0;
  if (yearA === yearB) return 1.0;
  if (Math.abs(yearA - yearB) <= 2) return 0.5;
  return 0;
}

function genderScore(a: Person, b: Person): number {
  if (a.gender === 'unknown' || b.gender === 'unknown') return 0.5;
  return a.gender === b.gender ? 1.0 : 0;
}

// ── Main matching ─────────────────────────────────────────────────────────────

const DEFAULT_THRESHOLD = 0.7;
const WEIGHT_NAME = 0.6;
const WEIGHT_BIRTH = 0.3;
const WEIGHT_GENDER = 0.1;

/**
 * Match source persons against target persons.
 * Returns pairs with confidence >= threshold, sorted by confidence desc.
 * Deterministic — same input always produces same output.
 */
export function matchPersons(
  sources: PersonMatchCandidate[],
  targets: PersonMatchCandidate[],
  threshold: number = DEFAULT_THRESHOLD,
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const source of sources) {
    let bestMatch: MatchResult | null = null;

    for (const target of targets) {
      // Skip matching within same lineage
      if (source.lineageId === target.lineageId) continue;

      const nScore = nameSimilarity(source.person.full_name, target.person.full_name);
      const bScore = birthYearScore(source.person, target.person);
      const gScore = genderScore(source.person, target.person);

      const confidence = WEIGHT_NAME * nScore + WEIGHT_BIRTH * bScore + WEIGHT_GENDER * gScore;

      if (confidence < threshold) continue;

      const matchedFields: MatchResult['matchedFields'] = [];
      if (nScore >= 0.8) matchedFields.push('name');
      if (bScore >= 0.5) matchedFields.push('birth_year');
      if (gScore >= 1.0) matchedFields.push('gender');

      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = {
          sourceId: source.namespacedId,
          targetId: target.namespacedId,
          confidence,
          matchedFields,
        };
      }
    }

    if (bestMatch) results.push(bestMatch);
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

/** Create a namespaced ID for cross-lineage identification */
export function makeNamespacedId(lineageId: number, personId: number): string {
  return `${lineageId}_${personId}`;
}

/** Parse a namespaced ID back to { lineageId, personId } */
export function parseNamespacedId(nsId: string): { lineageId: number; personId: number } {
  const [lineageStr, personStr] = nsId.split('_');
  return { lineageId: Number(lineageStr), personId: Number(personStr) };
}