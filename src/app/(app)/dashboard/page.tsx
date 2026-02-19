import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { Users, BookOpen, Calendar } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Xin chào, {user?.name ?? 'bạn'}!
        </h1>
        <p className="text-muted-foreground">
          Chào mừng bạn đến với Gia Phả Online
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Số dòng họ"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          value={null}
        />
        <StatCard
          title="Số thành viên"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={null}
        />
        <StatCard
          title="Sự kiện sắp tới"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={null}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value: number | null;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value.toLocaleString('vi-VN')}</p>
        )}
      </CardContent>
    </Card>
  );
}

