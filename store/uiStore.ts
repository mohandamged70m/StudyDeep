import { create } from "zustand";

interface UIState {
  leftOpen: boolean;
  rightOpen: boolean;
  showSourceModal: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  setShowSourceModal: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  leftOpen: true,
  rightOpen: true,
  showSourceModal: false,
  toggleLeft: () => set((s) => ({ leftOpen: !s.leftOpen })),
  toggleRight: () => set((s) => ({ rightOpen: !s.rightOpen })),
  setShowSourceModal: (show) => set({ showSourceModal: show }),
}));
