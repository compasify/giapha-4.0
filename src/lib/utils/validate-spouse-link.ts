import type { FamilyChartDatum } from '@/lib/transforms/family-chart-transform';

export interface SpouseLinkValidation {
  valid: boolean;
  reason?: string;
}

/**
 * Validate whether two persons can be linked as spouses.
 * Checks: not self, not already spouse, not direct parent-child.
 */
export function canLinkAsSpouse(
  personId: string,
  candidateId: string,
  data: FamilyChartDatum[],
): SpouseLinkValidation {
  if (personId === candidateId) {
    return { valid: false, reason: 'Không thể liên kết với chính mình' };
  }

  const person = data.find((d) => d.id === personId);
  const candidate = data.find((d) => d.id === candidateId);

  if (!person || !candidate) {
    return { valid: false, reason: 'Không tìm thấy người này' };
  }

  if (person.rels.spouses.includes(candidateId)) {
    return { valid: false, reason: 'Đã là vợ/chồng' };
  }

  if (person.rels.parents.includes(candidateId) || person.rels.children.includes(candidateId)) {
    return { valid: false, reason: 'Không thể liên kết cha/mẹ – con trực tiếp' };
  }

  return { valid: true };
}
