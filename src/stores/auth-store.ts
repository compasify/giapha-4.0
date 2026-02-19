import { create } from 'zustand';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
