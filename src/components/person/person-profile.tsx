'use client';

import { Person } from '@/types/person';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatFlexibleDate } from '@/lib/utils/flexible-date-utils';

const GENDER_LABELS: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
  unknown: 'Không rõ',
};

interface PersonProfileProps {
  person: Person;
}

export function PersonProfile({ person }: PersonProfileProps) {
  const initials = [person.ho, person.ten]
    .filter(Boolean)
    .map((s) => s![0])
    .join('');

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 shrink-0">
            <AvatarFallback className="text-2xl font-bold bg-muted">
              {initials || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{person.full_name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{GENDER_LABELS[person.gender] || person.gender}</Badge>
              {person.generation_number && (
                <Badge variant="outline">Thế hệ {person.generation_number}</Badge>
              )}
              {!person.is_alive && <Badge variant="secondary">Đã mất</Badge>}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              {person.birth_date && (
                <p>Sinh: {formatFlexibleDate(person.birth_date)}</p>
              )}
              {person.birth_place && <p>Nơi sinh: {person.birth_place}</p>}
              {!person.is_alive && person.death_date && (
                <p>Mất: {formatFlexibleDate(person.death_date)}</p>
              )}
              {!person.is_alive && person.death_place && (
                <p>Nơi mất: {person.death_place}</p>
              )}
            </div>
          </div>
        </div>

        {(person.ten_thuong_goi || person.ten_huy || person.ten_thuy || person.ten_hieu || person.han_nom_name) && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-2">Tên gọi khác</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {person.ten_thuong_goi && (
                  <>
                    <dt className="text-muted-foreground">Tên thường gọi</dt>
                    <dd>{person.ten_thuong_goi}</dd>
                  </>
                )}
                {person.ten_huy && (
                  <>
                    <dt className="text-muted-foreground">Tên huý</dt>
                    <dd>{person.ten_huy}</dd>
                  </>
                )}
                {person.ten_thuy && (
                  <>
                    <dt className="text-muted-foreground">Tên thuỵ</dt>
                    <dd>{person.ten_thuy}</dd>
                  </>
                )}
                {person.ten_hieu && (
                  <>
                    <dt className="text-muted-foreground">Hiệu</dt>
                    <dd>{person.ten_hieu}</dd>
                  </>
                )}
                {person.han_nom_name && (
                  <>
                    <dt className="text-muted-foreground">Tên Hán Nôm</dt>
                    <dd>{person.han_nom_name}</dd>
                  </>
                )}
              </dl>
            </div>
          </>
        )}

        {person.biography && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-2">Tiểu sử</h3>
              <p className="text-sm whitespace-pre-wrap">{person.biography}</p>
            </div>
          </>
        )}

        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{person.parents_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Cha mẹ</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{person.spouses_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Vợ/chồng</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{person.children_count ?? 0}</p>
            <p className="text-xs text-muted-foreground">Con cái</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
