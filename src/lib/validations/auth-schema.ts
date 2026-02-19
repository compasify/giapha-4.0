import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Vui lòng nhập email hoặc tên đăng nhập'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    username: z
      .string()
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
