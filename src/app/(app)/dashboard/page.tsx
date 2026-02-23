import { getCurrentUser } from '@/app/actions/auth-actions';
import { UpcomingEventsWidget } from '@/components/events/upcoming-events-widget';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';

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
      <DashboardStats />
      <UpcomingEventsWidget />
    </div>
  );
}
