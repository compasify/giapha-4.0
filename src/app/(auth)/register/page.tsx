'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth-schema';
import { registerAction } from '@/app/actions/auth-actions';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      const result = await registerAction({
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
      });
      if (!result.success) {
        toast.error(result.error ?? 'Đăng ký thất bại');
        return;
      }
      if (result.data) {
        setUser(result.data);
      }
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Đăng ký</CardTitle>
        <CardDescription>Tạo tài khoản Gia Phả Online mới</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="nguyenvana"
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
