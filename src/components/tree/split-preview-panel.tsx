'use client'

import { useMemo } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Users, GitBranch } from 'lucide-react'
import { FamilyChartDatum, RelationshipInfo } from '@/lib/transforms/family-chart-transform'

interface SplitPreviewPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: Set<string>
  data: FamilyChartDatum[]
  relationshipMap: Map<string, RelationshipInfo[]>
  onConfirm: () => void
}

export function SplitPreviewPanel({
  open,
  onOpenChange,
  selectedIds,
  data,
  relationshipMap,
  onConfirm,
}: SplitPreviewPanelProps) {
  const { personsToClone, relsToKeep, relsToDrop } = useMemo(() => {
    // Persons being cloned
    const persons = data.filter((d) => selectedIds.has(d.id))

    // Collect all unique relationships
    const allRels: RelationshipInfo[] = []
    const seenRelIds = new Set<number>()

    relationshipMap.forEach((rels) => {
      rels.forEach((rel) => {
        if (!seenRelIds.has(rel.id)) {
          allRels.push(rel)
          seenRelIds.add(rel.id)
        }
      })
    })

    // Partition relationships
    const kept: RelationshipInfo[] = []
    const dropped: RelationshipInfo[] = []

    allRels.forEach((rel) => {
      const fromInSelected = selectedIds.has(rel.fromId)
      const toInSelected = selectedIds.has(rel.toId)

      if (fromInSelected && toInSelected) {
        kept.push(rel)
      } else if (fromInSelected || toInSelected) {
        dropped.push(rel)
      }
    })

    return {
      personsToClone: persons,
      relsToKeep: kept,
      relsToDrop: dropped,
    }
  }, [data, selectedIds, relationshipMap])

  // Helper to get person by id
  const getPersonById = (id: string) => data.find((d) => d.id === id)

  // Helper to get person display name
  const getPersonName = (id: string) => {
    const person = getPersonById(id)
    return person?.data.full_name || id
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Xem trước tách nhánh</SheetTitle>
          <SheetDescription>
            {personsToClone.length} người sẽ được copy sang gia phả mới
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Selected Persons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <h3 className="font-medium">Người được chọn</h3>
            </div>
            <ScrollArea className="h-48 rounded-md border border-gray-200 p-3">
              <div className="space-y-2">
                {personsToClone.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between rounded-sm bg-gray-50 p-2"
                  >
                    <span className="text-sm">{person.data.full_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Đ{person.data.generation_number || '?'}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Section 2: Broken Relationships Warning */}
          {relsToDrop.length > 0 && (
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    {relsToDrop.length} mối quan hệ sẽ bị cắt đứt
                  </p>
                </div>
              </div>
              <ScrollArea className="h-40 rounded-sm">
                <div className="space-y-1 pr-4">
                  {relsToDrop.map((rel) => (
                    <div key={rel.id} className="text-xs text-amber-800">
                      <span className="font-medium">{getPersonName(rel.fromId)}</span>
                      <span className="mx-1">↔</span>
                      <span className="font-medium">{getPersonName(rel.toId)}</span>
                      <span className="mx-1 text-amber-700">({rel.type})</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Section 3: Kept Relationships */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <h3 className="font-medium">Quan hệ được giữ</h3>
              </div>
              <Badge variant="outline">{relsToKeep.length} quan hệ</Badge>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="flex-1"
          >
            Xác nhận tách
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
