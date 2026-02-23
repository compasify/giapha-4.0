'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, X, ChevronRight, ChevronLeft, Users } from 'lucide-react';
import type { LineageSource } from '@/lib/transforms/merge-lineages';
import {
  matchPersons,
  makeNamespacedId,
  type MatchResult,
  type PersonMappings,
  type PersonMatchCandidate,
} from '@/lib/transforms/person-matching';
import type { Person } from '@/types/person';

// ── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 'review' | 'confirm' | 'summary';

export interface PersonMatchingWizardProps {
  sources: Pick<LineageSource, 'lineageId'>[];
  /** Persons grouped by lineageId — fetched externally */
  personsMap: Map<number, Person[]>;
  /** Pre-existing mappings to restore (from lineage.settings) */
  initialMappings?: PersonMappings;
  onComplete: (mappings: PersonMappings) => void;
  onCancel: () => void;
}

interface ReviewedMatch extends MatchResult {
  status: 'confirmed' | 'rejected' | 'pending';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildCandidates(personsMap: Map<number, Person[]>): PersonMatchCandidate[] {
  const candidates: PersonMatchCandidate[] = [];
  for (const [lineageId, persons] of personsMap) {
    for (const person of persons) {
      candidates.push({
        person,
        lineageId,
        namespacedId: makeNamespacedId(lineageId, person.id),
      });
    }
  }
  return candidates;
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.9) return 'text-green-600';
  if (confidence >= 0.75) return 'text-yellow-600';
  return 'text-orange-600';
}

function confidencePercent(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

// ── Step 1: Review ──────────────────────────────────────────────────────────

function ReviewStep({
  matches,
  personsMap,
  onUpdate,
}: {
  matches: ReviewedMatch[];
  personsMap: Map<number, Person[]>;
  onUpdate: (matches: ReviewedMatch[]) => void;
}) {
  const personLookup = useMemo(() => {
    const map = new Map<string, Person>();
    for (const [lineageId, persons] of personsMap) {
      for (const p of persons) {
        map.set(makeNamespacedId(lineageId, p.id), p);
      }
    }
    return map;
  }, [personsMap]);

  const handleStatus = useCallback(
    (idx: number, status: ReviewedMatch['status']) => {
      const updated = [...matches];
      updated[idx] = { ...updated[idx], status };
      onUpdate(updated);
    },
    [matches, onUpdate],
  );

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Không tìm thấy thành viên trùng khớp giữa các gia phả.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Hệ thống phát hiện <strong>{matches.length}</strong> cặp có thể trùng. Xác nhận hoặc bỏ qua từng cặp.
      </p>
      {matches.map((m, idx) => {
        const source = personLookup.get(m.sourceId);
        const target = personLookup.get(m.targetId);
        if (!source || !target) return null;

        return (
          <Card key={`${m.sourceId}-${m.targetId}`} className={m.status === 'rejected' ? 'opacity-50' : ''}>
            <CardContent className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium truncate">{source.full_name}</span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="font-medium truncate">{target.full_name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-mono ${confidenceColor(m.confidence)}`}>
                    {confidencePercent(m.confidence)}
                  </span>
                  {m.matchedFields.map((f) => (
                    <Badge key={f} variant="outline" className="text-[10px] px-1 py-0">
                      {f === 'name' ? 'Tên' : f === 'birth_year' ? 'Năm sinh' : 'Giới tính'}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={m.status === 'confirmed' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleStatus(idx, m.status === 'confirmed' ? 'pending' : 'confirmed')}
                  title="Xác nhận trùng"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant={m.status === 'rejected' ? 'destructive' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleStatus(idx, m.status === 'rejected' ? 'pending' : 'rejected')}
                  title="Không trùng"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Step 2: Confirm ─────────────────────────────────────────────────────────

function ConfirmStep({
  matches,
}: {
  matches: ReviewedMatch[];
}) {
  const confirmed = matches.filter((m) => m.status === 'confirmed');
  const rejected = matches.filter((m) => m.status === 'rejected');
  const pending = matches.filter((m) => m.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-center">
        <Card>
          <CardContent className="py-3">
            <div className="text-2xl font-bold text-green-600">{confirmed.length}</div>
            <div className="text-xs text-muted-foreground">Đã xác nhận</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <div className="text-2xl font-bold text-red-600">{rejected.length}</div>
            <div className="text-xs text-muted-foreground">Đã bỏ qua</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
            <div className="text-xs text-muted-foreground">Chưa quyết định</div>
          </CardContent>
        </Card>
      </div>

      {pending.length > 0 && (
        <p className="text-sm text-yellow-600">
          Còn {pending.length} cặp chưa quyết định — sẽ được xem là &quot;người khác nhau&quot;.
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Nhấn &quot;Hoàn tất&quot; để xem cây kết hợp với {confirmed.length} thành viên được gộp.
      </p>
    </div>
  );
}

// ── Step 3: Summary ─────────────────────────────────────────────────────────

function SummaryStep({
  confirmedCount,
  totalPersons,
}: {
  confirmedCount: number;
  totalPersons: number;
}) {
  return (
    <div className="text-center py-6 space-y-3">
      <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold">Hoàn tất ghép nối!</h3>
      <p className="text-sm text-muted-foreground">
        {confirmedCount > 0
          ? `Đã gộp ${confirmedCount} thành viên trùng. Tổng cộng ${totalPersons} thành viên trong cây kết hợp.`
          : `Không có thành viên trùng. ${totalPersons} thành viên sẽ hiển thị riêng biệt.`}
      </p>
    </div>
  );
}

// ── Main Wizard ─────────────────────────────────────────────────────────────

const STEPS: WizardStep[] = ['review', 'confirm', 'summary'];

const STEP_LABELS: Record<WizardStep, string> = {
  review: 'Xem xét',
  confirm: 'Xác nhận',
  summary: 'Hoàn tất',
};

export function PersonMatchingWizard({
  sources,
  personsMap,
  initialMappings,
  onComplete,
  onCancel,
}: PersonMatchingWizardProps) {
  const [step, setStep] = useState<WizardStep>('review');
  const stepIndex = STEPS.indexOf(step);

  // Auto-detect matches
  const autoMatches = useMemo(() => {
    const candidates = buildCandidates(personsMap);
    if (candidates.length === 0) return [];

    // Split into per-lineage groups and match across
    const lineageIds = sources.map((s) => s.lineageId);
    if (lineageIds.length < 2) return [];

    const primary = candidates.filter((c) => c.lineageId === lineageIds[0]);
    const others = candidates.filter((c) => c.lineageId !== lineageIds[0]);

    return matchPersons(primary, others);
  }, [sources, personsMap]);

  // Initialize reviewed matches from auto-detected + initial mappings
  const [reviewedMatches, setReviewedMatches] = useState<ReviewedMatch[]>(() => {
    return autoMatches.map((m) => {
      let status: ReviewedMatch['status'] = 'pending';
      if (initialMappings) {
        const mapped = initialMappings[m.sourceId];
        if (mapped === m.targetId) status = 'confirmed';
        else if (mapped === 'skip') status = 'rejected';
      }
      return { ...m, status };
    });
  });

  const confirmedCount = reviewedMatches.filter((m) => m.status === 'confirmed').length;
  const totalPersons = useMemo(() => {
    let total = 0;
    for (const persons of personsMap.values()) total += persons.length;
    return total - confirmedCount; // subtract merged duplicates
  }, [personsMap, confirmedCount]);

  const handleNext = useCallback(() => {
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
    }
  }, [stepIndex]);

  const handleBack = useCallback(() => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) {
      setStep(STEPS[prevIdx]);
    }
  }, [stepIndex]);

  const handleComplete = useCallback(() => {
    const mappings: PersonMappings = {};
    for (const m of reviewedMatches) {
      if (m.status === 'confirmed') {
        // Source maps to target (target is canonical)
        mappings[m.sourceId] = m.targetId;
      } else if (m.status === 'rejected') {
        mappings[m.sourceId] = 'new';
      }
      // 'pending' = treated as different persons (default behavior in merge)
    }
    onComplete(mappings);
  }, [reviewedMatches, onComplete]);

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ghép nối thành viên</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <Badge variant={i <= stepIndex ? 'default' : 'outline'} className="text-xs">
                {i + 1}. {STEP_LABELS[s]}
              </Badge>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
        <Progress value={progress} className="mt-2 h-1" />
      </CardHeader>

      <CardContent>
        {step === 'review' && (
          <ReviewStep
            matches={reviewedMatches}
            personsMap={personsMap}
            onUpdate={setReviewedMatches}
          />
        )}
        {step === 'confirm' && <ConfirmStep matches={reviewedMatches} />}
        {step === 'summary' && (
          <SummaryStep confirmedCount={confirmedCount} totalPersons={totalPersons} />
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={step === 'review' ? onCancel : handleBack}>
            {step === 'review' ? (
              'Hủy'
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Quay lại
              </>
            )}
          </Button>

          {step === 'summary' ? (
            <Button onClick={handleComplete}>
              Xem cây kết hợp
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Tiếp theo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
