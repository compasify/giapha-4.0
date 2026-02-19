'use client';

import Link from 'next/link';
import { Person } from '@/types/person';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatFlexibleDate } from '@/lib/utils/flexible-date-utils';

const GENDER_LABELS: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
  unknown: 'Không rõ',
};

const GENDER_COLORS: Record<string, string> = {
  male: 'bg-blue-100 text-blue-700',
  female: 'bg-pink-100 text-pink-700',
  other: 'bg-purple-100 text-purple-700',
  unknown: 'bg-gray-100 text-gray-600',
};

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const initials = [person.ho, person.ten]
    .filter(Boolean)
    .map((s) => s![0])
    .join('');

  return (
    <Link href={`/person/${person.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold bg-muted">
              {initials || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <p className="font-semibold text-sm leading-tight">{person.full_name}</p>
            {person.generation_number && (
              <p className="text-xs text-muted-foreground">Thế hệ {person.generation_number}</p>
            )}
          </div>

          <Badge variant="outline" className={`text-xs ${GENDER_COLORS[person.gender] || ''}`}>
            {GENDER_LABELS[person.gender] || person.gender}
          </Badge>

          {person.birth_date && (
            <p className="text-xs text-muted-foreground">
              Sinh: {formatFlexibleDate(person.birth_date)}
            </p>
          )}

          {!person.is_alive && person.death_date && (
            <p className="text-xs text-muted-foreground">
              Mất: {formatFlexibleDate(person.death_date)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
