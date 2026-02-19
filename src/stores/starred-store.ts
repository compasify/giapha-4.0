import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StarredState {
  starredIds: string[];
  toggle: (id: string) => void;
  isStarred: (id: string) => boolean;
}

export const useStarredStore = create<StarredState>()(
  persist(
    (set, get) => ({
      starredIds: [],
      toggle: (id: string) => {
        const current = get().starredIds;
        const next = current.includes(id)
          ? current.filter((sid) => sid !== id)
          : [...current, id];
        set({ starredIds: next });
      },
      isStarred: (id: string) => get().starredIds.includes(id),
    }),
    { name: 'gia-pha-starred' }
  )
);
