/**
 * Configurable feature limits per user subscription tier.
 * Values can be overridden by server-driven config in the future.
 */

export type UserTier = 'free' | 'premium';

export interface CombinedViewLimits {
  maxLineages: number;
}

const TIER_LIMITS: Record<UserTier, CombinedViewLimits> = {
  free: { maxLineages: 3 },
  premium: { maxLineages: 10 },
};

/**
 * Get the maximum number of lineages allowed in combined view.
 * Default fallback: 3 (free tier).
 */
export function getMaxCombinedLineages(tier: UserTier = 'free'): number {
  return TIER_LIMITS[tier]?.maxLineages ?? 3;
}

/** Color palette for lineage differentiation in combined view (WCAG AA contrast) */
export const LINEAGE_COLORS: string[] = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
];