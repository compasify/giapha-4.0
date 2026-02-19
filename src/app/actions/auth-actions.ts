'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  username: string;
  role: string;
  avatar: string | null;
}

interface LoginPayload {
  login: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(payload: LoginPayload): Promise<ActionResult<AuthUser>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign_in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { login: payload.login, password: payload.password } }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.error || body?.message || 'Đăng nhập thất bại';
      return { success: false, error: message };
    }

    const authHeader = response.headers.get('Authorization');
    if (!authHeader) {
      return { success: false, error: 'Không nhận được token xác thực' };
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const body = await response.json();
    const user: AuthUser = body.data?.user;

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: user };
  } catch {
    return { success: false, error: 'Không thể kết nối đến máy chủ' };
  }
}

export async function registerAction(
  payload: RegisterPayload
): Promise<ActionResult<AuthUser>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          name: payload.name,
          email: payload.email,
          username: payload.username,
          password: payload.password,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const errors = body?.errors;
      if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors).flat()[0];
        return { success: false, error: String(firstError) };
      }
      const message = body?.error || body?.message || 'Đăng ký thất bại';
      return { success: false, error: message };
    }

    return loginAction({ login: payload.email, password: payload.password });
  } catch {
    return { success: false, error: 'Không thể kết nối đến máy chủ' };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    fetch(`${API_BASE_URL}/api/v1/auth/sign_out`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  cookieStore.delete('auth_token');
  redirect('/login');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate_token`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const body = await response.json();
    return body?.data?.user ?? null;
  } catch {
    return null;
  }
}
