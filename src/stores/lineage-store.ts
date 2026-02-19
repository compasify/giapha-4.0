import { create } from 'zustand';

interface LineageState {
  currentLineageId: number | null;
  setCurrentLineageId: (id: number | null) => void;
}

export const useLineageStore = create<LineageState>((set) => ({
  currentLineageId: null,
  setCurrentLineageId: (id) => set({ currentLineageId: id }),
}));
