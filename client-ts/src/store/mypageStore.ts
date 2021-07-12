import create from 'zustand';

export interface MypageState {
  userMenuAnchor: HTMLElement | null;
  handleUserMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
  handleUserMenuClose: () => void;
  notiAnchor: HTMLElement | null;
  handleNotiOpen: (e: React.MouseEvent<HTMLElement>) => void;
  handleNotiClose: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: (target?: boolean) => void;
}

export const useMypageStore = create<MypageState>((set, get) => {
  return {
    notiAnchor: null,
    handleNotiOpen: e => set({ notiAnchor: e.currentTarget }),
    handleNotiClose: () => set({ notiAnchor: null }),
    userMenuAnchor: null,
    handleUserMenuOpen: e => set({ userMenuAnchor: e.currentTarget }),
    handleUserMenuClose: () => set({ userMenuAnchor: null }),
    isDrawerOpen: false,
    toggleDrawer: (target?: boolean) => {
      if (typeof target === 'boolean') return set({ isDrawerOpen: target });
      const { isDrawerOpen } = get();
      return set({ isDrawerOpen: !isDrawerOpen });
    },
  };
});
