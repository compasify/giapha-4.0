import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { lookupKinshipTerm, lookupSpouseTerm, lookupInLawTerm, lookupSpouseRelativeTerm, type KinshipSide, type Gender } from './kinship-terms';

export interface KinshipResult {
  term: string;
  path: string[];
  description: string;
}

interface BfsNode {
  id: string;
  parent: string | null;
  edgeType: 'parent' | 'child' | 'spouse';
}

/**
 * BFS from personA to personB through family graph.
 * Returns the shortest path as array of [id, edgeType] pairs.
 */
function bfsPath(
  fromId: string,
  toId: string,
  dataMap: Map<string, FamilyChartDatum>,
): BfsNode[] | null {
  if (fromId === toId) return [];

  const visited = new Set<string>([fromId]);
  const queue: BfsNode[] = [{ id: fromId, parent: null, edgeType: 'parent' }];
  const parentMap = new Map<string, BfsNode>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const person = dataMap.get(current.id);
    if (!person) continue;

    const neighbors: { id: string; edgeType: BfsNode['edgeType'] }[] = [];

    for (const pid of person.rels.parents) {
      neighbors.push({ id: pid, edgeType: 'parent' });
    }
    for (const cid of person.rels.children) {
      neighbors.push({ id: cid, edgeType: 'child' });
    }
    for (const sid of person.rels.spouses) {
      neighbors.push({ id: sid, edgeType: 'spouse' });
    }

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.id)) continue;
      visited.add(neighbor.id);

      const node: BfsNode = {
        id: neighbor.id,
        parent: current.id,
        edgeType: neighbor.edgeType,
      };
      parentMap.set(neighbor.id, node);

      if (neighbor.id === toId) {
        const path: BfsNode[] = [];
        let cur: string | null = toId;
        while (cur && parentMap.has(cur)) {
          const found: BfsNode = parentMap.get(cur)!;
          path.unshift(found);
          cur = found.parent;
        }
        return path;
      }

      queue.push(node);
    }
  }

  return null;
}

interface PathAnalysis {
  genDiff: number;
  side: KinshipSide;
  isSpouse: boolean;
  isDirectLine: boolean;
  commonAncestorId: string | null;
}

function analyzePath(path: BfsNode[]): PathAnalysis {
  if (path.length === 0) {
    return { genDiff: 0, side: 'direct', isSpouse: false, isDirectLine: true, commonAncestorId: null };
  }

  // Check if it's a spouse relationship (single step)
  if (path.length === 1 && path[0].edgeType === 'spouse') {
    return { genDiff: 0, side: 'direct', isSpouse: true, isDirectLine: false, commonAncestorId: null };
  }

  let genDiff = 0;
  let goingUp = true;
  let isDirectLine = true;
  let commonAncestorId: string | null = null;

  for (const node of path) {
    if (node.edgeType === 'spouse') continue;

    if (node.edgeType === 'parent') {
      genDiff++;
      if (!goingUp) isDirectLine = false;
    } else if (node.edgeType === 'child') {
      if (goingUp) {
        goingUp = false;
        isDirectLine = false;
        commonAncestorId = node.parent;
      }
      genDiff--;
    }
  }

  // Determine side based on path through ancestors
  let side: KinshipSide = 'direct';
  if (!isDirectLine && commonAncestorId) {
    // Collateral: check if common ancestor is on paternal or maternal side
    // For simplicity: if the first step from A goes to a parent, check that parent's gender
    const firstStep = path[0];
    if (firstStep.edgeType === 'parent') {
      side = 'paternal'; // default to paternal for now
    }
  }

  return { genDiff, side, isSpouse: false, isDirectLine, commonAncestorId };
}

function determineIsOlder(
  personA: FamilyChartDatum,
  personB: FamilyChartDatum,
): boolean | undefined {
  const genA = personA.data.generation_number;
  const genB = personB.data.generation_number;
  if (genA !== null && genB !== null && genA !== genB) {
    return genB < genA;
  }
  const birthA = personA.data.birth_year;
  const birthB = personB.data.birth_year;
  if (birthA !== null && birthB !== null) {
    return birthB < birthA;
  }
  return undefined;
}

export function calculateKinship(
  personAId: string,
  personBId: string,
  data: FamilyChartDatum[],
): KinshipResult | null {
  if (personAId === personBId) return null;
  const dataMap = new Map(data.map((d) => [d.id, d]));
  const personA = dataMap.get(personAId);
  const personB = dataMap.get(personBId);
  if (!personA || !personB) return null;
  const path = bfsPath(personAId, personBId, dataMap);
  if (!path) return null;
  const genderB = personB.data.gender as Gender;
  const nameA = personA.data.full_name || personA.data.ten;
  const nameB = personB.data.full_name || personB.data.ten;
  const makePath = () => path.map((n) => n.id);
  const makeResult = (term: string): KinshipResult => ({
    term,
    path: makePath(),
    description: `${nameB} l\u00e0 ${term} c\u1ee7a ${nameA}`,
  });

  // ── Case 0: Direct spouse (single spouse edge) ───────────────────────────
  const analysis = analyzePath(path);
  if (analysis.isSpouse) {
    return makeResult(lookupSpouseTerm(genderB));
  }

  // Detect spouse edge positions
  const lastEdge = path[path.length - 1];
  const firstEdge = path[0];
  const endsWithSpouse = lastEdge?.edgeType === 'spouse';
  const startsWithSpouse = firstEdge?.edgeType === 'spouse';

  // ── Case 1: Terminal spouse (B is spouse of a blood relative) ─────────────
  // Path: A → ... → bloodRelative → B(spouse)
  // Example: A → son → son's wife = Con dâu
  if (endsWithSpouse && !startsWithSpouse) {
    const bloodPath = path.slice(0, -1);
    const bloodRelativeId = lastEdge.parent!;
    const bloodRelative = dataMap.get(bloodRelativeId);
    if (!bloodRelative) return makeResult('H\u1ecd h\u00e0ng (qua h\u00f4n nh\u00e2n)');

    const bloodGender = bloodRelative.data.gender as Gender;
    const bloodAnalysis = analyzePath(bloodPath);

    let resolvedSide = bloodAnalysis.side;
    const firstParentStep = !bloodAnalysis.isDirectLine
      ? bloodPath.find((n) => n.edgeType === 'parent')
      : null;
    if (firstParentStep && bloodAnalysis.commonAncestorId) {
      const firstParent = dataMap.get(firstParentStep.id);
      resolvedSide = firstParent?.data.gender === 'F' ? 'maternal' : 'paternal';
    }
    const side = bloodAnalysis.isDirectLine ? 'direct' : resolvedSide;

    let isOlder: boolean | undefined = undefined;
    if (bloodAnalysis.genDiff === 0) {
      isOlder = determineIsOlder(personA, bloodRelative);
    } else if (bloodAnalysis.genDiff === 1 && !bloodAnalysis.isDirectLine && bloodPath.length >= 2) {
      if (firstParentStep) {
        const mediator = dataMap.get(firstParentStep.id);
        if (mediator) isOlder = determineIsOlder(mediator, bloodRelative);
      }
    }

    const bloodTerm = lookupKinshipTerm(bloodAnalysis.genDiff, side, bloodGender, isOlder);
    if (!bloodTerm) return makeResult('H\u1ecd h\u00e0ng (qua h\u00f4n nh\u00e2n)');

    return makeResult(lookupInLawTerm(bloodTerm, genderB));
  }

  // ── Case 2: Initial spouse (B is blood relative of A's spouse) ────────────
  // Path: A → spouse → ... → B
  // Example: A → wife → wife's father = Bố vợ
  if (startsWithSpouse && !endsWithSpouse) {
    const spouseId = firstEdge.id;
    const spouse = dataMap.get(spouseId);
    if (!spouse) return makeResult('H\u1ecd h\u00e0ng (qua h\u00f4n nh\u00e2n)');
    const spouseGender = spouse.data.gender as Gender;

    const bloodPath = path.slice(1);
    const bloodAnalysis = analyzePath(bloodPath);

    let resolvedSide = bloodAnalysis.side;
    const firstParentStep = !bloodAnalysis.isDirectLine
      ? bloodPath.find((n) => n.edgeType === 'parent')
      : null;
    if (firstParentStep && bloodAnalysis.commonAncestorId) {
      const firstParent = dataMap.get(firstParentStep.id);
      resolvedSide = firstParent?.data.gender === 'F' ? 'maternal' : 'paternal';
    }
    const side = bloodAnalysis.isDirectLine ? 'direct' : resolvedSide;

    let isOlder: boolean | undefined = undefined;
    if (bloodAnalysis.genDiff === 0) {
      isOlder = determineIsOlder(spouse, personB);
    } else if (bloodAnalysis.genDiff === 1 && !bloodAnalysis.isDirectLine && bloodPath.length >= 2) {
      if (firstParentStep) {
        const mediator = dataMap.get(firstParentStep.id);
        if (mediator) isOlder = determineIsOlder(mediator, personB);
      }
    }

    const bloodTerm = lookupKinshipTerm(bloodAnalysis.genDiff, side, genderB, isOlder);
    if (!bloodTerm) return makeResult('H\u1ecd h\u00e0ng (qua h\u00f4n nh\u00e2n)');

    return makeResult(lookupSpouseRelativeTerm(bloodTerm, spouseGender));
  }

  // ── Case 3: Both ends spouse (complex) ────────────────────────────────────
  if (startsWithSpouse && endsWithSpouse) {
    return makeResult('H\u1ecd h\u00e0ng (qua h\u00f4n nh\u00e2n)');
  }

  // ── Case 4: Blood-only path (original logic) ─────────────────────────────
  let resolvedSide = analysis.side;
  const firstParentStep = path.find((n) => n.edgeType === 'parent') ?? null;
  if (firstParentStep && analysis.commonAncestorId) {
    const firstParent = dataMap.get(firstParentStep.id);
    resolvedSide = firstParent?.data.gender === 'F' ? 'maternal' : 'paternal';
  }

  let isOlder: boolean | undefined = undefined;
  if (analysis.genDiff === 0) {
    isOlder = determineIsOlder(personA, personB);
  } else if (analysis.genDiff === 1 && !analysis.isDirectLine && path.length >= 2) {
    if (firstParentStep) {
      const mediator = dataMap.get(firstParentStep.id);
      if (mediator) isOlder = determineIsOlder(mediator, personB);
    }
  }
  // Direct line: genDiff 0-1 use 'direct'; genDiff >= 2 resolve to paternal/maternal
  let side: KinshipSide;
  if (analysis.isDirectLine) {
    if (Math.abs(analysis.genDiff) >= 2 && firstParentStep) {
      const firstParent = dataMap.get(firstParentStep.id);
      side = firstParent?.data.gender === 'F' ? 'maternal' : 'paternal';
    } else {
      side = 'direct';
    }
  } else {
    side = resolvedSide;
  }
  const term = lookupKinshipTerm(analysis.genDiff, side, genderB, isOlder);
  if (!term) {
    return {
      term: `H\u1ecd h\u00e0ng (${Math.abs(analysis.genDiff)} \u0111\u1eddi)`,
      path: makePath(),
      description: `${nameB} l\u00e0 h\u1ecd h\u00e0ng c\u1ee7a ${nameA}`,
    };
  }

  return makeResult(term);
}
