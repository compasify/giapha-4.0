'use client';

import { useState, useEffect } from 'react';
import { useLineage } from '@/hooks/use-lineages';
import { AccessCodeDialog, hasStoredAccess } from '@/components/tree/access-code-dialog';
import { TreeView } from './tree-view';
import { Skeleton } from '@/components/ui/skeleton';

interface PrivacyGateProps {
  lineageId: number;
}

export function PrivacyGate({ lineageId }: PrivacyGateProps) {
  const { data: lineage, isLoading } = useLineage(lineageId);
  const [accessGranted, setAccessGranted] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!lineage) return;
    if (lineage.privacy_level !== 2) {
      setAccessGranted(true);
    } else {
      setAccessGranted(hasStoredAccess(lineageId));
    }
    setChecked(true);
  }, [lineage, lineageId]);

  if (isLoading || !checked) {
    return (
      <div className="-m-4 md:-m-6 flex flex-col gap-2 p-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[calc(100vh-180px)] w-full" />
      </div>
    );
  }

  if (lineage?.privacy_level === 2 && !accessGranted) {
    return (
      <AccessCodeDialog
        lineageId={lineageId}
        open={true}
        onVerified={() => setAccessGranted(true)}
      />
    );
  }

  return <TreeView lineageId={lineageId} />;
}
