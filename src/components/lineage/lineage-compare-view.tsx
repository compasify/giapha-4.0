'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, GitBranch, Calendar, ChevronRight } from 'lucide-react';
import { useLineage } from '@/hooks/use-lineages';
import type { Lineage } from '@/types/lineage';
import type { Person } from '@/types/person';
import type { MatchResult } from '@/lib/transforms/person-matching';
import {
  matchPersons,
  makeNamespacedId,
  type PersonMatchCandidate,
} from '@/lib/transforms/person-matching';

interface LineageCompareViewProps {
  lineageIds: number[];
  personsMap: Map<number, Person[]>;
  isLoading: boolean;
  onContinue: (autoMatches: MatchResult[]) => void;
}

function LineageStatsCard({ lineageId, persons }: { lineageId: number; persons: Person[] }) {
  const { data: lineage, isLoading } = useLineage(lineageId);

  if (isLoading) return <Skeleton className="h-40 rounded-lg" />;
  if (!lineage) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base truncate">{lineage.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{persons.length} thành viên</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Tạo {new Date(lineage.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function LineageCompareView({
  lineageIds,
  personsMap,
  isLoading,
  onContinue,
}: LineageCompareViewProps) {
  const autoMatches = useMemo(() => {
    if (personsMap.size < 2) return [];

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

    const primaryLineageId = lineageIds[0];
    const primary = candidates.filter((c) => c.lineageId === primaryLineageId);
    const others = candidates.filter((c) => c.lineageId !== primaryLineageId);

    return matchPersons(primary, others);
  }, [lineageIds, personsMap]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lineageIds.map((id) => (
            <Skeleton key={id} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lineageIds.map((id) => (
          <LineageStatsCard
            key={id}
            lineageId={id}
            persons={personsMap.get(id) ?? []}
          />
        ))}
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Phát hiện <strong>~{autoMatches.length}</strong> thành viên có thể trùng
              </span>
            </div>
            {autoMatches.length > 0 && (
              <Badge variant="secondary">{autoMatches.length} cặp</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => onContinue(autoMatches)}>
          Tiếp theo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
