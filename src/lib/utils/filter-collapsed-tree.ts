import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

/**
 * Filter out all descendants of collapsed nodes.
 * Returns the filtered data + a map of collapsedId → hidden descendant count.
 */
export function filterByCollapsed(
  data: FamilyChartDatum[],
  collapsedIds: Set<string>,
): { filtered: FamilyChartDatum[]; hiddenCounts: Map<string, number> } {
  if (collapsedIds.size === 0) {
    return { filtered: data, hiddenCounts: new Map() };
  }

  const dataMap = new Map(data.map((d) => [d.id, d]));
  const hiddenCounts = new Map<string, number>();
  const hiddenIds = new Set<string>();

  for (const collapsedId of collapsedIds) {
    const root = dataMap.get(collapsedId);
    if (!root) continue;

    const queue = [...root.rels.children];
    let count = 0;

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (hiddenIds.has(id)) continue;
      hiddenIds.add(id);
      count++;

      const person = dataMap.get(id);
      if (!person) continue;

      // Hide children's spouses too (they're visually part of the subtree)
      for (const spouseId of person.rels.spouses) {
        if (!hiddenIds.has(spouseId) && !collapsedIds.has(spouseId)) {
          hiddenIds.add(spouseId);
          count++;
        }
      }

      for (const childId of person.rels.children) {
        if (!hiddenIds.has(childId)) queue.push(childId);
      }
    }

    hiddenCounts.set(collapsedId, count);
  }

  const filtered = data
    .filter((d) => !hiddenIds.has(d.id))
    .map((d) => {
      const hasHiddenChildren = d.rels.children.some((cid) => hiddenIds.has(cid));
      if (!hasHiddenChildren) return d;

      return {
        ...d,
        rels: {
          ...d.rels,
          children: d.rels.children.filter((cid) => !hiddenIds.has(cid)),
        },
      };
    });

  return { filtered, hiddenCounts };
}
