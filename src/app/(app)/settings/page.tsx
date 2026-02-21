import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cài đặt</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Cài đặt tài khoản</CardTitle>
          </div>
          <CardDescription>
            Tính năng cài đặt đang được phát triển. Vui lòng quay lại sau.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Các tùy chọn sắp ra mắt: đổi mật khẩu, cập nhật thông tin cá nhân, quản lý quyền truy cập.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
