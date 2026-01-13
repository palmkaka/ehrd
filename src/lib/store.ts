import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  companyId: string;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  activeModule: 'chat' | 'docs' | 'calendar' | 'contacts' | 'tasks';
  setActiveModule: (module: AppStore['activeModule']) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  activeModule: 'chat',
  setActiveModule: (module) => set({ activeModule: module }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
