import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';
import { lookupKinshipTerm, lookupSpouseTerm, type KinshipSide, type Gender } from './kinship-terms';

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

  const analysis = analyzePath(path);
  const genderB = personB.data.gender as Gender;
  const nameA = personA.data.full_name || personA.data.ten;
  const nameB = personB.data.full_name || personB.data.ten;

  if (analysis.isSpouse) {
    const term = lookupSpouseTerm(genderB);
    return {
      term,
      path: path.map((n) => n.id),
      description: `${nameB} là ${term} của ${nameA}`,
    };
  }

  const isOlder = analysis.genDiff === 0 ? determineIsOlder(personA, personB) : undefined;

  // For direct line: use genDiff directly
  // genDiff > 0 means B is in older generation (ancestor of A)
  // genDiff < 0 means B is in younger generation (descendant of A)
  const side = analysis.isDirectLine ? 'direct' : analysis.side;
  const term = lookupKinshipTerm(analysis.genDiff, side, genderB, isOlder);

  if (!term) {
    return {
      term: `Họ hàng (${Math.abs(analysis.genDiff)} đời)`,
      path: path.map((n) => n.id),
      description: `${nameB} là họ hàng của ${nameA}`,
    };
  }

  return {
    term,
    path: path.map((n) => n.id),
    description: `${nameB} là ${term} của ${nameA}`,
  };
}
