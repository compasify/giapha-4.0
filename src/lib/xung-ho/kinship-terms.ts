/**
 * Vietnamese kinship term lookup table.
 *
 * Terms are keyed by: generation_diff (positive = older generation),
 * side (paternal/maternal), and gender of the relative.
 *
 * Birth order (anh/chi vs em) is resolved at runtime by comparing
 * birth_year or generation_number.
 */

export type KinshipSide = 'paternal' | 'maternal' | 'direct';
export type Gender = 'M' | 'F';

interface KinshipKey {
  genDiff: number;
  side: KinshipSide;
  gender: Gender;
  isOlder?: boolean;
}

function key(k: KinshipKey): string {
  const older = k.isOlder !== undefined ? (k.isOlder ? 'older' : 'younger') : '*';
  return `${k.genDiff}:${k.side}:${k.gender}:${older}`;
}

// genDiff = generation of B relative to A
// positive = B is older generation (ancestor direction)
// negative = B is younger generation (descendant direction)
// 0 = same generation
const TERMS = new Map<string, string>();

// ── Direct line (parent/child/grandparent/grandchild) ──────────────────────
// +1 = parent generation
TERMS.set(key({ genDiff: 1, side: 'direct', gender: 'M', isOlder: undefined }), 'Cha');
TERMS.set(key({ genDiff: 1, side: 'direct', gender: 'F', isOlder: undefined }), 'Mẹ');

// +2 = grandparent
TERMS.set(key({ genDiff: 2, side: 'paternal', gender: 'M' }), 'Ông nội');
TERMS.set(key({ genDiff: 2, side: 'paternal', gender: 'F' }), 'Bà nội');
TERMS.set(key({ genDiff: 2, side: 'maternal', gender: 'M' }), 'Ông ngoại');
TERMS.set(key({ genDiff: 2, side: 'maternal', gender: 'F' }), 'Bà ngoại');

// +3 = great-grandparent
TERMS.set(key({ genDiff: 3, side: 'paternal', gender: 'M' }), 'Cụ ông nội');
TERMS.set(key({ genDiff: 3, side: 'paternal', gender: 'F' }), 'Cụ bà nội');
TERMS.set(key({ genDiff: 3, side: 'maternal', gender: 'M' }), 'Cụ ông ngoại');
TERMS.set(key({ genDiff: 3, side: 'maternal', gender: 'F' }), 'Cụ bà ngoại');

// +4 = great-great-grandparent (kỵ)
TERMS.set(key({ genDiff: 4, side: 'paternal', gender: 'M' }), 'Kỵ ông nội');
TERMS.set(key({ genDiff: 4, side: 'paternal', gender: 'F' }), 'Kỵ bà nội');
TERMS.set(key({ genDiff: 4, side: 'maternal', gender: 'M' }), 'Kỵ ông ngoại');
TERMS.set(key({ genDiff: 4, side: 'maternal', gender: 'F' }), 'Kỵ bà ngoại');

// +5 (tổ)
TERMS.set(key({ genDiff: 5, side: 'paternal', gender: 'M' }), 'Ông Sơ nội');
TERMS.set(key({ genDiff: 5, side: 'paternal', gender: 'F' }), 'Bà Sơ nội');
TERMS.set(key({ genDiff: 5, side: 'maternal', gender: 'M' }), 'Ông Sơ ngoại');
TERMS.set(key({ genDiff: 5, side: 'maternal', gender: 'F' }), 'Bà Sơ ngoại');

// -1 = child
TERMS.set(key({ genDiff: -1, side: 'direct', gender: 'M' }), 'Con trai');
TERMS.set(key({ genDiff: -1, side: 'direct', gender: 'F' }), 'Con gái');

// -2 = grandchild
TERMS.set(key({ genDiff: -2, side: 'direct', gender: 'M' }), 'Cháu trai');
TERMS.set(key({ genDiff: -2, side: 'direct', gender: 'F' }), 'Cháu gái');

// -3 = great-grandchild
TERMS.set(key({ genDiff: -3, side: 'direct', gender: 'M' }), 'Chắt trai');
TERMS.set(key({ genDiff: -3, side: 'direct', gender: 'F' }), 'Chắt gái');

// -4 = great-great-grandchild
TERMS.set(key({ genDiff: -4, side: 'direct', gender: 'M' }), 'Chút trai');
TERMS.set(key({ genDiff: -4, side: 'direct', gender: 'F' }), 'Chút gái');

// -5
TERMS.set(key({ genDiff: -5, side: 'direct', gender: 'M' }), 'Chít trai');
TERMS.set(key({ genDiff: -5, side: 'direct', gender: 'F' }), 'Chít gái');

// ── Same generation (siblings/cousins) ─────────────────────────────────────
// 0, same gen, older
TERMS.set(key({ genDiff: 0, side: 'direct', gender: 'M', isOlder: true }), 'Anh');
TERMS.set(key({ genDiff: 0, side: 'direct', gender: 'F', isOlder: true }), 'Chị');
TERMS.set(key({ genDiff: 0, side: 'direct', gender: 'M', isOlder: false }), 'Em trai');
TERMS.set(key({ genDiff: 0, side: 'direct', gender: 'F', isOlder: false }), 'Em gái');

// cousins (paternal)
TERMS.set(key({ genDiff: 0, side: 'paternal', gender: 'M', isOlder: true }), 'Anh họ (nội)');
TERMS.set(key({ genDiff: 0, side: 'paternal', gender: 'F', isOlder: true }), 'Chị họ (nội)');
TERMS.set(key({ genDiff: 0, side: 'paternal', gender: 'M', isOlder: false }), 'Em họ trai (nội)');
TERMS.set(key({ genDiff: 0, side: 'paternal', gender: 'F', isOlder: false }), 'Em họ gái (nội)');

// cousins (maternal)
TERMS.set(key({ genDiff: 0, side: 'maternal', gender: 'M', isOlder: true }), 'Anh họ (ngoại)');
TERMS.set(key({ genDiff: 0, side: 'maternal', gender: 'F', isOlder: true }), 'Chị họ (ngoại)');
TERMS.set(key({ genDiff: 0, side: 'maternal', gender: 'M', isOlder: false }), 'Em họ trai (ngoại)');
TERMS.set(key({ genDiff: 0, side: 'maternal', gender: 'F', isOlder: false }), 'Em họ gái (ngoại)');

// ── Paternal uncles/aunts (+1 gen, collateral) ─────────────────────────────
// Father's older brother
TERMS.set(key({ genDiff: 1, side: 'paternal', gender: 'M', isOlder: true }), 'Bác trai');
// Father's younger brother
TERMS.set(key({ genDiff: 1, side: 'paternal', gender: 'M', isOlder: false }), 'Chú');
// Father's sister
TERMS.set(key({ genDiff: 1, side: 'paternal', gender: 'F', isOlder: true }), 'Bác gái');
TERMS.set(key({ genDiff: 1, side: 'paternal', gender: 'F', isOlder: false }), 'Cô');

// ── Maternal uncles/aunts (+1 gen, collateral) ─────────────────────────────
// Mother's brother
TERMS.set(key({ genDiff: 1, side: 'maternal', gender: 'M', isOlder: true }), 'Cậu');
TERMS.set(key({ genDiff: 1, side: 'maternal', gender: 'M', isOlder: false }), 'Cậu');
// Mother's older sister
TERMS.set(key({ genDiff: 1, side: 'maternal', gender: 'F', isOlder: true }), 'Bác gái');
// Mother's younger sister
TERMS.set(key({ genDiff: 1, side: 'maternal', gender: 'F', isOlder: false }), 'Dì');

// ── Nephew/niece (-1 gen, collateral) ──────────────────────────────────────
TERMS.set(key({ genDiff: -1, side: 'paternal', gender: 'M' }), 'Cháu trai');
TERMS.set(key({ genDiff: -1, side: 'paternal', gender: 'F' }), 'Cháu gái');
TERMS.set(key({ genDiff: -1, side: 'maternal', gender: 'M' }), 'Cháu trai');
TERMS.set(key({ genDiff: -1, side: 'maternal', gender: 'F' }), 'Cháu gái');

// ── Spouse ─────────────────────────────────────────────────────────────────
TERMS.set('spouse:M', 'Chồng');
TERMS.set('spouse:F', 'Vợ');

/**
 * Look up Vietnamese kinship term.
 * Returns the term string or null if no match found.
 */
export function lookupKinshipTerm(
  genDiff: number,
  side: KinshipSide,
  gender: Gender,
  isOlder?: boolean,
): string | null {
  // Try exact match with isOlder
  if (isOlder !== undefined) {
    const exact = TERMS.get(key({ genDiff, side, gender, isOlder }));
    if (exact) return exact;
  }

  // Try without isOlder (wildcard)
  const wildcard = TERMS.get(key({ genDiff, side, gender }));
  if (wildcard) return wildcard;

  // Fallback: try direct side for collateral relationships
  if (side !== 'direct') {
    const direct = TERMS.get(key({ genDiff, side: 'direct', gender, isOlder }));
    if (direct) return direct;
    const directWild = TERMS.get(key({ genDiff, side: 'direct', gender }));
    if (directWild) return directWild;
  }

  // Generic fallback for deep generations
  if (genDiff > 5) return `Tổ tiên ${genDiff} đời`;
  if (genDiff < -5) return `Hậu duệ ${Math.abs(genDiff)} đời`;

  return null;
}

export function lookupSpouseTerm(gender: Gender): string {
  return TERMS.get(`spouse:${gender}`) ?? 'Vợ/Chồng';
}
