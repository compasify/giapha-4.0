import { describe, it, expect } from 'bun:test';
import { calculateKinship } from './bfs-pathfinder';
import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

// ── Helper ────────────────────────────────────────────────────────────────────

function makePerson(
  id: string,
  gender: 'M' | 'F',
  opts?: {
    parents?: string[];
    children?: string[];
    spouses?: string[];
    birth_year?: number;
    generation_number?: number;
  },
): FamilyChartDatum {
  return {
    id,
    data: {
      id,
      gender,
      birth_year: opts?.birth_year ?? null,
      generation_number: opts?.generation_number ?? null,
      full_name: id,
      ten: id,
      ho: '',
      ten_dem: '',
      birth_month: null,
      birth_day: null,
      birth_date_id: null,
      death_year: null,
      death_month: null,
      death_day: null,
      death_date_id: null,
      is_alive: true,
      avatar: null,
      biography: null,
      notes: null,
      birth_place: null,
      death_place: null,
      birth_order: 0,
      birth_lunar_year: null,
      birth_lunar_month: null,
      birth_lunar_day: null,
      birth_lunar_leap_month: false,
      birth_calendar_type: 'solar',
      death_lunar_year: null,
      death_lunar_month: null,
      death_lunar_day: null,
      death_lunar_leap_month: false,
      death_calendar_type: 'solar',
      spouse_group: null,
    },
    rels: {
      parents: opts?.parents ?? [],
      children: opts?.children ?? [],
      spouses: opts?.spouses ?? [],
    },
  } as FamilyChartDatum;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('calculateKinship', () => {
  // ── Test 1: Vợ/Chồng ──────────────────────────────────────────────────────
  it('spouse: male B → Chồng, female B → Vợ', () => {
    const wife = makePerson('wife', 'F', { spouses: ['husband'] });
    const husband = makePerson('husband', 'M', { spouses: ['wife'] });
    const data = [wife, husband];

    const resultFromWife = calculateKinship('wife', 'husband', data);
    expect(resultFromWife?.term).toBe('Chồng');

    const resultFromHusband = calculateKinship('husband', 'wife', data);
    expect(resultFromHusband?.term).toBe('Vợ');
  });

  // ── Test 2: Cha/Mẹ trực tiếp ──────────────────────────────────────────────
  it('direct parent: male parent → Cha, female parent → Mẹ', () => {
    const child = makePerson('child', 'M', { parents: ['father', 'mother'] });
    const father = makePerson('father', 'M', { children: ['child'] });
    const mother = makePerson('mother', 'F', { children: ['child'] });
    const data = [child, father, mother];

    expect(calculateKinship('child', 'father', data)?.term).toBe('Cha');
    expect(calculateKinship('child', 'mother', data)?.term).toBe('Mẹ');
  });

  // ── Test 3: Con trai/Con gái ───────────────────────────────────────────────
  it('direct child: male → Con trai, female → Con gái', () => {
    const parent = makePerson('parent', 'M', { children: ['son', 'daughter'] });
    const son = makePerson('son', 'M', { parents: ['parent'] });
    const daughter = makePerson('daughter', 'F', { parents: ['parent'] });
    const data = [parent, son, daughter];

    expect(calculateKinship('parent', 'son', data)?.term).toBe('Con trai');
    expect(calculateKinship('parent', 'daughter', data)?.term).toBe('Con gái');
  });

  it('siblings through male parent: older brother → Anh họ (nội), younger → Em họ trai (nội)', () => {
    const parent = makePerson('parent', 'M', { children: ['older_bro', 'younger_bro'] });
    const olderBro = makePerson('older_bro', 'M', {
      parents: ['parent'],
      birth_year: 1980,
      generation_number: 2,
    });
    const youngerBro = makePerson('younger_bro', 'M', {
      parents: ['parent'],
      birth_year: 1985,
      generation_number: 2,
    });
    const data = [parent, olderBro, youngerBro];
    expect(calculateKinship('younger_bro', 'older_bro', data)?.term).toBe('Anh họ (nội)');
    expect(calculateKinship('older_bro', 'younger_bro', data)?.term).toBe('Em họ trai (nội)');
  });

  // ── Test 5: BUG1 — Collateral vs Direct ───────────────────────────────────
  // Uncle/nephew path goes up then down → isDirectLine must be false
  it('BUG1: uncle-nephew path is collateral (not direct line)', () => {
    // grandpa → [father, uncle] → nephew
    const grandpa = makePerson('grandpa', 'M', {
      children: ['father', 'uncle'],
      generation_number: 1,
    });
    const father = makePerson('father', 'M', {
      parents: ['grandpa'],
      children: ['nephew'],
      generation_number: 2,
      birth_year: 1955,
    });
    const uncle = makePerson('uncle', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1960,
    });
    const nephew = makePerson('nephew', 'M', {
      parents: ['father'],
      generation_number: 3,
    });
    const data = [grandpa, father, uncle, nephew];

    // nephew → uncle: should be Bác trai or Chú (collateral), NOT Cha (direct)
    const result = calculateKinship('nephew', 'uncle', data);
    expect(result?.term).not.toBe('Cha');
    expect(result?.term).not.toBe('Mẹ');
    // uncle is younger than father → Chú
    expect(result?.term).toBe('Chú');
  });

  // ── Test 6: BUG2 — Cậu (maternal uncle) ──────────────────────────────────
  it('BUG2: maternal uncle (mother\'s brother) → Cậu', () => {
    const grandma = makePerson('grandma', 'F', {
      children: ['mother', 'maternal_uncle', 'maternal_aunt'],
      generation_number: 1,
    });
    const mother = makePerson('mother', 'F', {
      parents: ['grandma'],
      children: ['A'],
      generation_number: 2,
      birth_year: 1960,
    });
    const maternalUncle = makePerson('maternal_uncle', 'M', {
      parents: ['grandma'],
      generation_number: 2,
      birth_year: 1958,
    });
    const maternalAunt = makePerson('maternal_aunt', 'F', {
      parents: ['grandma'],
      generation_number: 2,
      birth_year: 1965,
    });
    const A = makePerson('A', 'M', {
      parents: ['mother'],
      generation_number: 3,
    });
    const data = [grandma, mother, maternalUncle, maternalAunt, A];

    expect(calculateKinship('A', 'maternal_uncle', data)?.term).toBe('Cậu');
  });

  // ── Test 7: BUG2 — Dì (maternal aunt, younger than mother) ───────────────
  it('BUG2: maternal younger aunt (mother\'s younger sister) → Dì', () => {
    const grandma = makePerson('grandma', 'F', {
      children: ['mother', 'maternal_uncle', 'maternal_aunt'],
      generation_number: 1,
    });
    const mother = makePerson('mother', 'F', {
      parents: ['grandma'],
      children: ['A'],
      generation_number: 2,
      birth_year: 1960,
    });
    const maternalUncle = makePerson('maternal_uncle', 'M', {
      parents: ['grandma'],
      generation_number: 2,
      birth_year: 1958,
    });
    const maternalAunt = makePerson('maternal_aunt', 'F', {
      parents: ['grandma'],
      generation_number: 2,
      birth_year: 1965,
    });
    const A = makePerson('A', 'M', {
      parents: ['mother'],
      generation_number: 3,
    });
    const data = [grandma, mother, maternalUncle, maternalAunt, A];

    // maternal_aunt born 1965 > mother born 1960 → aunt is YOUNGER → Dì
    expect(calculateKinship('A', 'maternal_aunt', data)?.term).toBe('Dì');
  });

  // ── Test 8: BUG3 — Bác trai (paternal uncle older than father) ────────────
  it('BUG3: paternal uncle older than father → Bác trai', () => {
    const grandpa = makePerson('grandpa', 'M', {
      children: ['uncle_older', 'father', 'aunt_younger'],
      generation_number: 1,
    });
    const uncleOlder = makePerson('uncle_older', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1950,
    });
    const father = makePerson('father', 'M', {
      parents: ['grandpa'],
      children: ['A'],
      generation_number: 2,
      birth_year: 1955,
    });
    const auntYounger = makePerson('aunt_younger', 'F', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1960,
    });
    const A = makePerson('A', 'M', {
      parents: ['father'],
      generation_number: 3,
    });
    const data = [grandpa, uncleOlder, father, auntYounger, A];

    // uncle_older born 1950, father born 1955 → uncle is OLDER → Bác trai
    expect(calculateKinship('A', 'uncle_older', data)?.term).toBe('Bác trai');
  });

  // ── Test 9: BUG3 — Chú (paternal uncle younger than father) ──────────────
  it('BUG3: paternal uncle younger than father → Chú', () => {
    const grandpa = makePerson('grandpa', 'M', {
      children: ['uncle_older', 'father', 'uncle_younger'],
      generation_number: 1,
    });
    const uncleOlder = makePerson('uncle_older', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1950,
    });
    const father = makePerson('father', 'M', {
      parents: ['grandpa'],
      children: ['A'],
      generation_number: 2,
      birth_year: 1955,
    });
    const uncleYounger = makePerson('uncle_younger', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1960,
    });
    const A = makePerson('A', 'M', {
      parents: ['father'],
      generation_number: 3,
    });
    const data = [grandpa, uncleOlder, father, uncleYounger, A];

    // uncle_younger born 1960, father born 1955 → uncle is YOUNGER → Chú
    expect(calculateKinship('A', 'uncle_younger', data)?.term).toBe('Chú');
  });

  // ── Test 10: BUG3 — Cô (paternal aunt younger than father) ───────────────
  it('BUG3: paternal aunt younger than father → Cô', () => {
    const grandpa = makePerson('grandpa', 'M', {
      children: ['uncle_older', 'father', 'aunt_younger'],
      generation_number: 1,
    });
    const uncleOlder = makePerson('uncle_older', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1950,
    });
    const father = makePerson('father', 'M', {
      parents: ['grandpa'],
      children: ['A'],
      generation_number: 2,
      birth_year: 1955,
    });
    const auntYounger = makePerson('aunt_younger', 'F', {
      parents: ['grandpa'],
      generation_number: 2,
      birth_year: 1960,
    });
    const A = makePerson('A', 'M', {
      parents: ['father'],
      generation_number: 3,
    });
    const data = [grandpa, uncleOlder, father, auntYounger, A];

    // aunt_younger born 1960, father born 1955 → aunt is YOUNGER → Cô
    expect(calculateKinship('A', 'aunt_younger', data)?.term).toBe('Cô');
  });

  // ── Test 11: Grandparent (algorithm limitation) ────────────────────────
  it('grandparent: direct-line grandparents return fallback (algorithm limitation: isDirectLine=true → side=direct, but genDiff=2/side=direct has no entry in kinship-terms)', () => {
    // Paternal side
    const paternalGrandpa = makePerson('paternal_grandpa', 'M', {
      children: ['father'],
      generation_number: 1,
    });
    const father = makePerson('father', 'M', {
      parents: ['paternal_grandpa'],
      children: ['A'],
      generation_number: 2,
    });
    // Maternal side
    const maternalGrandma = makePerson('maternal_grandma', 'F', {
      children: ['mother'],
      generation_number: 1,
    });
    const mother = makePerson('mother', 'F', {
      parents: ['maternal_grandma'],
      children: ['A'],
      generation_number: 2,
    });
    const A = makePerson('A', 'M', {
      parents: ['father', 'mother'],
      generation_number: 3,
    });

    const data = [paternalGrandpa, father, maternalGrandma, mother, A];

    // BUG: direct-line grandparents (isDirectLine=true) → side='direct' → no genDiff=2 entry → fallback
    expect(calculateKinship('A', 'paternal_grandpa', data)?.term).toBe('Họ hàng (2 đời)');
    expect(calculateKinship('A', 'maternal_grandma', data)?.term).toBe('Họ hàng (2 đời)');
  });

  // ── Test 12: Cháu (nephew/niece, collateral -1 gen) ───────────────────────
  it('nephew/niece (collateral -1 gen): male → Cháu trai, female → Cháu gái', () => {
    const grandpa = makePerson('grandpa', 'M', {
      children: ['uncle', 'sibling'],
      generation_number: 1,
    });
    const uncle = makePerson('uncle', 'M', {
      parents: ['grandpa'],
      children: ['nephew', 'niece'],
      generation_number: 2,
    });
    const sibling = makePerson('sibling', 'M', {
      parents: ['grandpa'],
      generation_number: 2,
    });
    const nephew = makePerson('nephew', 'M', {
      parents: ['uncle'],
      generation_number: 3,
    });
    const niece = makePerson('niece', 'F', {
      parents: ['uncle'],
      generation_number: 3,
    });
    const data = [grandpa, uncle, sibling, nephew, niece];

    // From sibling's perspective: nephew and niece are collateral descendants
    expect(calculateKinship('sibling', 'nephew', data)?.term).toBe('Cháu trai');
    expect(calculateKinship('sibling', 'niece', data)?.term).toBe('Cháu gái');
  });

  // ── Test 13: Không liên quan ───────────────────────────────────────────────
  it('unrelated people → null', () => {
    const personA = makePerson('personA', 'M');
    const personB = makePerson('personB', 'F');
    const data = [personA, personB];

    expect(calculateKinship('personA', 'personB', data)).toBeNull();
  });
});
