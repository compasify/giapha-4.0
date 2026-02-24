'use client';

import { useEffect } from 'react';
import { useAuthStore, initLocalUser } from '@/stores/auth-store';
import type { AuthUser } from '@/app/actions/auth-actions';

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      clearUser();
    }
    // Auto-init local user for desktop mode
    initLocalUser();
  }, [user, setUser, clearUser]);

  return null;
}