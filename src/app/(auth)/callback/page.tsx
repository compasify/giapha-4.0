'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { storeOAuthToken } from '@/app/actions/auth-actions';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace('/login');
      return;
    }

    if (!token) {
      toast.error('Không nhận được token xác thực');
      router.replace('/login');
      return;
    }

    storeOAuthToken(token).then((result) => {
      if (result.success && result.data) {
        setUser(result.data);
        router.replace('/dashboard');
      } else {
        setStatus('error');
        toast.error(result.error ?? 'Đăng nhập thất bại');
        router.replace('/login');
      }
    });
  }, [searchParams, setUser, router]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {status === 'loading' ? 'Đang xác thực...' : 'Đã xảy ra lỗi'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {status === 'loading' && (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        )}
      </CardContent>
    </Card>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Đang xác thực...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </CardContent>
        </Card>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
